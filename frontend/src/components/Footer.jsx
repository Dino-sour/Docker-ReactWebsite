import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerStyle = {
    padding: '40px 100px',
    backgroundColor: '#0b2204',
    color: '#f7eedf'
  };

  const linksContainerStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '20px'
  };

  const linkStyle = {
    color: '#f7eedf',
    textDecoration: 'none',
    fontFamily: 'Lora, sans-serif'
  };

  const copyrightStyle = {
    textAlign: 'center',
    margin: 0,
    fontFamily: 'Lora, sans-serif'
  };

  return (
    <footer style={footerStyle}>
      <div style={linksContainerStyle}>
        <Link to="/about/contact" style={linkStyle}>About us</Link>
        <Link to="/menu" style={linkStyle}>Menu</Link>
        <Link to="/about/faq" style={linkStyle}>FAQs</Link>
        <Link to="/leagues" style={linkStyle}>Leagues</Link>
        <Link to="/events" style={linkStyle}>Events</Link>
        <Link to="/pricing" style={linkStyle}>Pricing</Link>
      </div>
      <p style={copyrightStyle}>© 2024 Billiards Club. All rights reserved.</p>
    </footer>
  );
};

export default Footer;