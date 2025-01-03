import React, { useState, useEffect } from 'react';
import PlayerSignup from './PlayerSignup';
import PlayerCard from './PlayerCard';
import ModifyProfile from './ModifyProfile';
import './TeamFinder.css';

const TeamFinder = () => {
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [selectedNights, setSelectedNights] = useState([]);
  const [selectedSkillLevels, setSelectedSkillLevels] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    email: '',
    password: ''
  });
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [message, setMessage] = useState(null);
  const [playerId, setPlayerId] = useState(null);

  const availableNights = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
  ];

  const skillLevels = [
    'Beginner',
    'Intermediate',
    'Advanced',
    'Professional'
  ];

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/players');
      if (!response.ok) {
        throw new Error('Failed to fetch players');
      }
      const data = await response.json();
      if (data.success) {
        setPlayers(data.players);
      } else {
        throw new Error(data.error || 'Failed to fetch players');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching players:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterPlayers = () => {
    return players.filter(player => {
      // If no filters are selected, show all players
      if (selectedNights.length === 0 && selectedSkillLevels.length === 0) {
        return true;
      }

      // Check if player matches selected nights
      const matchesNights = selectedNights.length === 0 || 
        selectedNights.some(night => player.play_nights.includes(night));

      // Check if player matches selected skill levels
      const matchesSkill = selectedSkillLevels.length === 0 || 
        selectedSkillLevels.includes(player.skill_level);

      return matchesNights && matchesSkill;
    });
  };

  const handleNightFilter = (night) => {
    setSelectedNights(prev => 
      prev.includes(night)
        ? prev.filter(n => n !== night)
        : [...prev, night]
    );
  };

  const handleSkillFilter = (skill) => {
    setSelectedSkillLevels(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleProfileLookup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/players/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: profileData.email,
          password: profileData.password
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setShowProfileEditor(true);
        setPlayerId(data.playerId);
      } else {
        setMessage({ type: 'error', text: data.error || 'Invalid email or password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error authenticating user' });
    }
  };

  const renderTeamFinderContent = () => (
    <>
      <div className="team-finder-header">
        <h1>Find Your Perfect Team</h1>
        <p>
          Connect with other players and find the perfect team match. Whether you're looking to join
          an existing team or create a new one, this is your starting point.
        </p>
        <button 
          className="create-profile-button"
          onClick={() => setShowSignupForm(true)}
        >
          Create Player Profile
        </button>
      </div>

      <div className="team-finder-content">
        <div className="players-section">
          <div className="players-header">
            <h2>Available Players</h2>
            <div className="active-filters">
              {selectedNights.length > 0 && (
                <div className="filter-tag">
                  Nights: {selectedNights.join(', ')}
                </div>
              )}
              {selectedSkillLevels.length > 0 && (
                <div className="filter-tag">
                  Skills: {selectedSkillLevels.join(', ')}
                </div>
              )}
            </div>
          </div>
          
          {loading ? (
            <div className="players-placeholder">Loading players...</div>
          ) : error ? (
            <div className="error-message">Error: {error}</div>
          ) : filterPlayers().length === 0 ? (
            <div className="players-placeholder">
              No players found matching your criteria
            </div>
          ) : (
            <div className="players-list">
              {filterPlayers().map(player => (
                <PlayerCard key={player.player_id} player={player} />
              ))}
            </div>
          )}
        </div>

        <div className="info-section">
          <div className="filter-card">
            <h3>Filter Players</h3>
            <div className="filter-sections">
              <div className="filter-section">
                <div className="filter-category">
                  <h4>Availability</h4>
                  <div className="nights-container">
                    {availableNights.map(night => (
                      <label key={night} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedNights.includes(night)}
                          onChange={() => handleNightFilter(night)}
                        />
                        <span>{night}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="filter-section">
                <div className="filter-category">
                  <h4>Skill Level</h4>
                  <div className="skill-container">
                    {skillLevels.map(skill => (
                      <label key={skill} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedSkillLevels.includes(skill)}
                          onChange={() => handleSkillFilter(skill)}
                        />
                        <span>{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-manager-card">
            <h3>Manage Your Profile</h3>
            <form onSubmit={handleProfileLookup}>
              <div className="teamFinder-form-group">
                <label htmlFor="email">
                  Email:
                  <div className="info-icon-container">
                    <span className="info-icon">i</span>
                    <span className="tooltip">
                      Use the email and password you created your account with
                    </span>
                  </div>
                </label>
                <input
                  type="email"
                  id="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    email: e.target.value
                  }))}
                  required
                />
              </div>
              <div className="teamFinder-form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={profileData.password}
                  onChange={(e) => setProfileData(prev => ({
                    ...prev,
                    password: e.target.value
                  }))}
                  required
                />
              </div>
              <button type="submit" className="lookup-button">
                Access My Profile
              </button>
            </form>
            {message && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const renderSignupForm = () => (
    <PlayerSignup 
      onClose={() => setShowSignupForm(false)}
      onComplete={() => {
        setShowSignupForm(false);
        fetchPlayers();
      }}
    />
  );

  return (
    <div className="team-finder-page">
      <div className="team-finder-container">
        {showProfileEditor ? (
          <ModifyProfile
            playerId={playerId}
            onClose={() => {
              setShowProfileEditor(false);
              setProfileData({ email: '', password: '' });
            }}
            onProfileUpdate={fetchPlayers}
          />
        ) : showSignupForm ? (
          renderSignupForm()
        ) : (
          renderTeamFinderContent()
        )}
      </div>
    </div>
  );
};

export default TeamFinder;