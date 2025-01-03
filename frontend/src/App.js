import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import FAQPage from './components/FAQPage';
import Events from './components/Events';
import Menu from './components/Menu';
import Pricing from './components/Pricing';
import Leagues from './components/Leagues';
import Contact from './components/Contact';
import Home from './components/Home';
import AdminPanel from './components/AdminPanel';
import TeamFinder from './components/TeamFinder';
import LeagueRegistration from './components/LeagueRegistration';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={
            <>
              <NavBar />
              <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/home" element={<Home/>} />
                <Route path="/events" element={<Events />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/leagues" element={<Leagues />} />
                <Route path="/about/faq" element={<FAQPage />} />
                <Route path="/about/contact" element={<Contact/>} />
                <Route path="/leagues/registration" element={<LeagueRegistration />} />
                <Route path="/leagues/team-finder" element={<TeamFinder />} />
              </Routes>
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;