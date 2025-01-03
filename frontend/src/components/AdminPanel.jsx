import React, { useState } from 'react';
import './AdminPanel.css';
import AddFAQModal from './AddFAQModal';
import FAQManagement from './FAQManagement';
import TeamManagement from './TeamManagement';
import PricingManagement from './PricingManagement';
import MenuManagement from './MenuManagement';

const AdminPanel = () => {
  const [selectedComponent, setSelectedComponent] = useState('FAQ Management');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderContent = () => {
    switch(selectedComponent) {
      case 'FAQ Management':
        return <FAQManagement />;
      
      case 'Teams Management':
        return <TeamManagement />;
      
      case 'Pricing Management': 
        return <PricingManagement />;
      
      case 'Menu Management':
        return <MenuManagement />;
      case 'Contact Information':
      case 'Events Management':
        return <div className="content-section">Feature coming soon!</div>;
        
      default:
        return <div className="content-section">Select a management option</div>;
    }
  };

  return (
    <div className="admin-panel">
      <div className="sidebar">
        <h1>Admin Control Panel</h1>
        <nav>
          <button 
            className={selectedComponent === 'FAQ Management' ? 'active' : ''}
            onClick={() => setSelectedComponent('FAQ Management')}
          >
            FAQ Management
          </button>
          <button 
            className={selectedComponent === 'Teams Management' ? 'active' : ''}
            onClick={() => setSelectedComponent('Teams Management')}
          >
            Teams Management
          </button>
          <button
            className={selectedComponent === 'Menu Management' ? 'active' : ''} 
            onClick={() => setSelectedComponent('Menu Management')}
          >
            Menu Management
          </button>
          <button onClick={() => setSelectedComponent('Contact Information')}>
            Contact Information
          </button>
          <button 
            className={selectedComponent === 'Pricing Management' ? 'active' : ''}
            onClick={() => setSelectedComponent('Pricing Management')}
          >
            Pricing Management
          </button>
          <button onClick={() => setSelectedComponent('Events Management')}>
            Events Management
          </button>
        </nav>
      </div>
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminPanel;