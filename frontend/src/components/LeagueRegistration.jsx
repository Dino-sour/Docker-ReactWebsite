import React, { useState, useEffect } from 'react';
import PlayerInputs from './PlayerInputs';
import TeamListItem from './TeamListItem';
import ContactForm from './ContactForm';
import './LeagueRegistration.css';

const LeagueRegistration = () => {
  const [selectedNight, setSelectedNight] = useState('all');
  const [players, setPlayers] = useState(['']);
  const [message, setMessage] = useState(null);
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [teams, setTeams] = useState({
    tentative: [],
    registered: []
  });

  const [contactFormOpen, setContactFormOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const handleContactClick = (team) => {
    setSelectedTeam(team);
    setContactFormOpen(true);
  };

  const [formData, setFormData] = useState({
    teamName: '',
    captainEmail: '',
    night: '',
    contactByPlayers: false
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/teams/league-teams');
      if (!response.ok) throw new Error('Failed to fetch teams');
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setMessage({
        type: 'error',
        text: 'Error loading teams. Please try again.'
      });
    }
  };

  useEffect(() => {
    if (message) {
      setIsMessageVisible(true);
      const timer = setTimeout(() => {
        setIsMessageVisible(false);
        setTimeout(() => {
          setMessage(null);
        }, 500);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/teams/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamName: formData.teamName,
          captainEmail: formData.captainEmail,
          night: formData.night,
          players: players.filter(player => player.trim() !== ''),
          contactByPlayers: formData.contactByPlayers
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setFormData({
        teamName: '',
        captainEmail: '',
        night: '',
        contactByPlayers: false
      });
      setPlayers(['']);
      
      setMessage({
        type: 'success',
        text: 'Team Registration Successful'
      });

      // Fetch updated teams list
      fetchTeams();
    } catch (error) {
      console.error('Error registering team:', error);
      setMessage({
        type: 'error',
        text: 'Error registering team. Please try again.'
      });
    }
  };

  const filterTeams = (teamList) => {
    if (selectedNight === 'all') return teamList;
    return teamList.filter(team => team.play_night === selectedNight);
  };

  return (
    <div className="league-registration">
      {message && (
        <div className={`message ${message.type} ${!isMessageVisible ? 'fade-out' : ''}`}>
          {message.text}
        </div>
      )}

      <div className="night-select-container">
        <select 
          value={selectedNight} 
          onChange={(e) => setSelectedNight(e.target.value)}
          className="night-select"
        >
          <option value="all">Select Night</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
        </select>
      </div>

      <div className="registration-container">
        <div className="left-container">
          <div className="registration-box">
            <h2>Registered Teams</h2>
            <div className="teams-list-container">  {/* New wrapper div */}
              {filterTeams(teams.registered).map(team => (
                <TeamListItem 
                    key={team.team_id}
                    teamName={team.team_name}
                    canContact={team.accepting_new_players === 1}
                    onContactClick={() => handleContactClick(team)} // Modified to pass full team
                    playNight={team.play_night}
                />
              ))}
              {filterTeams(teams.registered).length === 0 && (
                <p className="no-teams">No teams registered for this night</p>
              )}
            </div>
          </div>
          
          <div className="registration-box">
            <h2>Tentative Teams</h2>
            <div className="teams-list-container">  {/* New wrapper div */}
              {filterTeams(teams.tentative).map(team => (
                <TeamListItem 
                    key={team.team_id}
                    teamName={team.team_name}
                    canContact={team.accepting_new_players === 1}
                    onContactClick={() => handleContactClick(team)} // Modified to pass full team
                    playNight={team.play_night}
                />
              ))}
              {filterTeams(teams.tentative).length === 0 && (
                <p className="no-teams">No tentative teams for this night</p>
              )}
            </div>
          </div>
        </div>

        <div className="signup-box">
          <h2>Team Registration</h2>
          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-group">
              <label htmlFor="teamName">Team Name:</label>
              <input
                type="text"
                id="teamName"
                name="teamName"
                value={formData.teamName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="captainEmail">Captains Email:</label>
              <input
                type="email"
                id="captainEmail"
                name="captainEmail"
                value={formData.captainEmail}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="night">Night:</label>
              <select
                id="night"
                name="night"
                value={formData.night}
                onChange={handleInputChange}
                required
                className="night-select"
              >
                <option value="">Select Night</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
              </select>
            </div>

            <div className="form-group">
              <label>Players:</label>
              <PlayerInputs players={players} setPlayers={setPlayers} />
            </div>

            <div className="form-group checkbox-group">
              <div className="checkbox-label-container">
                <input
                  type="checkbox"
                  name="contactByPlayers"
                  checked={formData.contactByPlayers}
                  onChange={handleInputChange}
                />
                <span>Allow players to contact you about joining?</span>
              </div>
              <div className="info-icon-container">
                <span className="info-icon">i</span>
                <span className="tooltip">
                  By checking this box, you agree to let other players contact you about joining your team. Your email will not be displayed to them until you respond.
                </span>
              </div>
            </div>

            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>
      </div>
      {selectedTeam && (
        <ContactForm 
          recipientName={selectedTeam.team_name}
          recipientId={selectedTeam.team_id}
          recipientType="team"
          messagePlaceholder="Tell the team a bit about yourself..."
          isOpen={contactFormOpen}
          onClose={() => {
            setContactFormOpen(false);
            setSelectedTeam(null);
          }}
        />
      )}
    </div>
  );
};

export default LeagueRegistration;