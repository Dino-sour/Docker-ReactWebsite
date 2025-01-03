import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
 const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
 const [isLeagueDropdownOpen, setIsLeagueDropdownOpen] = useState(false);
 const timeoutRef = useRef(null);
 const leagueTimeoutRef = useRef(null);

 const handleMouseEnter = (setter) => {
  if (timeoutRef.current) clearTimeout(timeoutRef.current);
  if (leagueTimeoutRef.current) clearTimeout(leagueTimeoutRef.current);
  
  // Close other dropdown
  if (setter === setIsAboutDropdownOpen) {
    setIsLeagueDropdownOpen(false);
  } else {
    setIsAboutDropdownOpen(false);
  }
  
  setter(true);
};

 const handleMouseLeave = (setter, timeoutRefToUse) => {
   timeoutRefToUse.current = setTimeout(() => {
     setter(false);
   }, 150);
 };

 return (
   <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="nav-sections-container">
            <div className="nav-section left">
              <Link to="/events" className="nav-link">Events</Link>
              <Link to="/menu" className="nav-link">Menu</Link>
              <Link to="/pricing" className="nav-link">Pricing</Link>
            </div>

            <div className="nav-section center">
              <Link to="/" className="logo-container">
                <img src="/logo.png" alt="Billiard Club" className="logo" />
              </Link>
            </div>

            <div className="nav-section right">
              <div 
                className="dropdown"
                onMouseEnter={() => handleMouseEnter(setIsLeagueDropdownOpen)}
                onMouseLeave={() => handleMouseLeave(setIsLeagueDropdownOpen, leagueTimeoutRef)}
              >
                <button className="dropdown-button">
                  Leagues
                  <span className="dropdown-arrow">▼</span>
                </button>
                
                {isLeagueDropdownOpen && (
                  <div 
                    className="dropdown-menu"
                    onMouseEnter={() => handleMouseEnter(setIsLeagueDropdownOpen)}
                    onMouseLeave={() => handleMouseLeave(setIsLeagueDropdownOpen, leagueTimeoutRef)}
                  >
                    <Link to="/leagues/registration" className="dropdown-item">League Registration</Link>
                    <Link to="/leagues/team-finder" className="dropdown-item">Team Finder</Link>
                  </div>
                )}
              </div>

              <div 
                className="dropdown"
                onMouseEnter={() => handleMouseEnter(setIsAboutDropdownOpen)}
                onMouseLeave={() => handleMouseLeave(setIsAboutDropdownOpen, timeoutRef)}
              >
                <button className="dropdown-button">
                  About
                  <span className="dropdown-arrow">▼</span>
                </button>
                
                {isAboutDropdownOpen && (
                  <div 
                    className="dropdown-menu"
                    onMouseEnter={() => handleMouseEnter(setIsAboutDropdownOpen)}
                    onMouseLeave={() => handleMouseLeave(setIsAboutDropdownOpen, timeoutRef)}
                  >
                    <Link to="/about/faq" className="dropdown-item">FAQ</Link>
                    <Link to="/about/contact" className="dropdown-item">Contact</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
   </nav>
 );
};

export default NavBar;