const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

//get all league teams
router.get('/league-teams', async (req, res) => {
  try {
    const [teams] = await pool.query(`
      SELECT 
        t.team_id,
        t.name as team_name,
        t.accepting_new_players,
        COALESCE(tlr.registration_status, 'tentative') as registration_status,
        tlr.league_id,
        l.play_night
      FROM Team t
      LEFT JOIN TeamLeagueRegistration tlr ON t.team_id = tlr.team_id
      LEFT JOIN League l ON tlr.league_id = l.league_id
      ORDER BY t.team_id DESC
    `);

    //group teams by status
    const groupedTeams = {
      tentative: teams.filter(team => !team.registration_status || team.registration_status === 'tentative'),
      registered: teams.filter(team => team.registration_status === 'confirmed')
    };

    res.json(groupedTeams);
  } catch (err) {
    console.error('Error fetching teams:', err);
    res.status(500).json({ error: err.message });
  }
});

//get detailed team information for admin panel
router.get('/admin/teams', async (req, res) => {
  try {
    const [teams] = await pool.query(`
      SELECT 
        t.team_id,
        t.name as team_name,
        t.captain_email,
        t.accepting_new_players,
        tlr.registration_status,
        tlr.registration_date,
        tlr.payment_date,
        l.play_night,
        l.league_id,
        GROUP_CONCAT(tp.player_name) as players
      FROM Team t
      LEFT JOIN TeamLeagueRegistration tlr ON t.team_id = tlr.team_id
      LEFT JOIN League l ON tlr.league_id = l.league_id
      LEFT JOIN TeamPlayer tp ON t.team_id = tp.team_id
      GROUP BY t.team_id
      ORDER BY tlr.registration_date DESC
    `);

    res.json({
      success: true,
      teams: teams.map(team => ({
        ...team,
        players: team.players ? team.players.split(',') : []
      }))
    });
  } catch (err) {
    console.error('Error fetching teams for admin:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

//update team registration status (admin)
router.put('/admin/teams/:teamId/status', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { teamId } = req.params;
    const { status } = req.body;

    if (!['tentative', 'confirmed'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be either "tentative" or "confirmed"'
      });
    }

    await connection.beginTransaction();

    const [updateResult] = await connection.query(
      `UPDATE TeamLeagueRegistration 
       SET registration_status = ?,
           payment_date = CASE 
             WHEN ? = 'confirmed' THEN CURDATE()
             ELSE NULL
           END
       WHERE team_id = ?`,
      [status, status, teamId]
    );

    if (updateResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        error: 'Team registration not found'
      });
    }

    await connection.commit();
    
    res.json({
      success: true,
      message: `Team registration status updated to ${status}`
    });

  } catch (err) {
    await connection.rollback();
    console.error('Error updating team status:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  } finally {
    connection.release();
  }
});

//delete team (admin)
router.delete('/admin/teams/:teamId', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { teamId } = req.params;

    await connection.beginTransaction();

    //delete team players
    await connection.query(
      'DELETE FROM TeamPlayer WHERE team_id = ?',
      [teamId]
    );

    //delete team league registrations
    await connection.query(
      'DELETE FROM TeamLeagueRegistration WHERE team_id = ?',
      [teamId]
    );

    //delete the team
    const [deleteResult] = await connection.query(
      'DELETE FROM Team WHERE team_id = ?',
      [teamId]
    );

    if (deleteResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        error: 'Team not found'
      });
    }

    await connection.commit();
    
    res.json({
      success: true,
      message: 'Team and related records deleted successfully'
    });

  } catch (err) {
    await connection.rollback();
    console.error('Error deleting team:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  } finally {
    connection.release();
  }
});

//register a new team with players
router.post('/register', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { teamName, captainEmail, night, players, contactByPlayers } = req.body;
    
    // Validate required fields
    if (!teamName || !captainEmail || !night || !players) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    //validate night value against enum
    const validNights = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    if (!validNights.includes(night)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid play night value'
      });
    }

    await connection.beginTransaction();
    
    console.log('Received registration request:', {
      teamName,
      captainEmail,
      night,
      playerCount: players.length,
      contactByPlayers
    });

    //first, find the league_id based on the play night
    const [leagues] = await connection.query(
      'SELECT league_id FROM League WHERE play_night = ?',
      [night]
    );

    //if no league exists for this night, create one
    let leagueId;
    if (leagues.length === 0) {
      const [newLeague] = await connection.query(
        `INSERT INTO League (
          name, 
          play_night, 
          play_time, 
          table_type,
          max_teams,
          tables_reserved
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          `${night} League`, 
          night, 
          '19:00:00',
          1,  //default table type
          8,  //default max teams
          4   //default tables reserved
        ]
      );
      leagueId = newLeague.insertId;
    } else {
      leagueId = leagues[0].league_id;
    }

    //insert team
    const [teamResult] = await connection.query(
      'INSERT INTO Team (name, captain_email, accepting_new_players) VALUES (?, ?, ?)',
      [teamName, captainEmail, contactByPlayers ? 1 : 0]
    );

    const teamId = teamResult.insertId;

    //create TeamLeagueRegistration record with league_id
    await connection.query(
      'INSERT INTO TeamLeagueRegistration (team_id, league_id, registration_status, registration_date) VALUES (?, ?, ?, CURDATE())',
      [teamId, leagueId, 'tentative']
    );

    //insert players
    const playerInsertPromises = players
      .filter(playerName => playerName.trim())
      .map(async (playerName) => {
        const [playerResult] = await connection.query(
          'INSERT INTO TeamPlayer (team_id, player_name, join_date) VALUES (?, ?, CURDATE())',
          [teamId, playerName.trim()]
        );
        console.log('Player inserted:', playerName, playerResult);
        return playerResult;
      });

    await Promise.all(playerInsertPromises);
    await connection.commit();
    
    console.log('Transaction committed successfully');
    
    res.json({ 
      success: true, 
      message: 'Team registered successfully', 
      teamId: teamId 
    });

  } catch (err) {
    await connection.rollback();
    console.error('Error in team registration:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Failed to register team'
    });
  } finally {
    connection.release();
  }
});

//test route to verify database connection
router.get('/test-connection', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT 1');
    res.json({ 
      success: true, 
      message: 'Database connection successful',
      result 
    });
  } catch (err) {
    console.error('Database connection test failed:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

module.exports = router;