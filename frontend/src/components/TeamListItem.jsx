import React from 'react';

const TeamListItem = ({ teamName, canContact, onContactClick, playNight }) => {
  return (
    <div className="team-list-item">
      <div className="team-info">
        <span className="team-name">{teamName}</span>
      </div>
      {canContact && (
        <button 
          className="contact-button"
          onClick={() => onContactClick(teamName)}
        >
          Contact
        </button>
      )}
    </div>
  );
};

export default TeamListItem;