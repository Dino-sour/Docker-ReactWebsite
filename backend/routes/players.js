const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const crypto = require('crypto');

//create the connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

//get all players
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        player_id,
        name,
        email,
        bio,
        play_nights,
        skill_level,
        created_at,
        active
      FROM PlayerFinder
      WHERE active = true
      ORDER BY created_at DESC
    `);

    const players = rows.map(player => ({
      ...player,
      play_nights: JSON.parse(player.play_nights)
    }));

    res.json({
      success: true,
      players
    });
  } catch (err) {
    console.error('Error fetching players:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

//hash password helper function
const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

//authenticate player
router.post('/authenticate', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { email, password } = req.body;

    //input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    //hash the provided password
    const hashedPassword = hashPassword(password);

    //get user by email and password hash
    const [users] = await connection.query(
      'SELECT player_id FROM PlayerFinder WHERE email = ? AND password_hash = ? AND active = true',
      [email, hashedPassword]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    //authentication successful
    res.json({
      success: true,
      playerId: users[0].player_id
    });

  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred during authentication'
    });
  } finally {
    connection.release();
  }
});

//register new player
router.post('/register', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { name, email, password, bio, skillLevel, playNights } = req.body;

    //validate required fields
    if (!name || !email || !password || !skillLevel || !playNights || playNights.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    //check if email already exists
    const [existingUsers] = await connection.query(
      'SELECT player_id FROM PlayerFinder WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    //hash password with crypto
    const passwordHash = hashPassword(password);

    //insert new player
    const [result] = await connection.query(
      `INSERT INTO PlayerFinder (
        name,
        email,
        password_hash,
        bio,
        play_nights,
        skill_level
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name,
        email,
        passwordHash,
        bio || null,
        JSON.stringify(playNights),
        skillLevel
      ]
    );

    res.json({
      success: true,
      playerId: result.insertId,
      message: 'Player registered successfully'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'An error occurred during registration'
    });
  } finally {
    connection.release();
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        player_id,
        name,
        email,
        bio,
        play_nights,
        skill_level,
        created_at,
        active
      FROM PlayerFinder
      WHERE player_id = ? AND active = true
    `, [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Player not found'
      });
    }

    const player = {
      ...rows[0],
      play_nights: JSON.parse(rows[0].play_nights)
    };

    res.json({
      success: true,
      player
    });

  } catch (err) {
    console.error('Error fetching player:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

//update player
router.put('/:id', async (req, res) => {
  try {
    const { bio, skillLevel, playNights } = req.body;
    
    const [result] = await pool.query(`
      UPDATE PlayerFinder 
      SET bio = ?, 
          skill_level = ?,
          play_nights = ?
      WHERE player_id = ? AND active = true
    `, [bio, skillLevel, JSON.stringify(playNights), req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Player not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (err) {
    console.error('Error updating player:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

//delete player (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query(`
      UPDATE PlayerFinder 
      SET active = false 
      WHERE player_id = ?
    `, [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Player not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile deleted successfully'
    });

  } catch (err) {
    console.error('Error deleting player:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;