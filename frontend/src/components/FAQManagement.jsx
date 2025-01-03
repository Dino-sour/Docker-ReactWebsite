import React, { useState, useEffect } from 'react';
import AddFAQModal from './AddFAQModal';
import './FAQManagement.css';

const FAQManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/faqs');
      const data = await response.json();
      setFaqs(data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      showAlert('error', 'Failed to fetch FAQs');
    }
  };

  const handleDeleteFAQ = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/faqs/${id}`, {
        method: 'DELETE'
      });
      fetchFAQs();
      showAlert('success', 'FAQ deleted successfully');
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      showAlert('error', 'Failed to delete FAQ');
    }
  };

  const handleAddFAQ = async (newFAQ) => {
    try {
      const response = await fetch('http://localhost:5000/api/faqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFAQ),
      });
      
      if (response.ok) {
        setIsModalOpen(false);
        fetchFAQs();
        showAlert('success', 'FAQ added successfully');
      }
    } catch (error) {
      console.error('Error adding FAQ:', error);
      showAlert('error', 'Failed to add FAQ');
    }
  };

  const showAlert = (type, message) => {
    setAlertMessage({ type, message });
    setTimeout(() => setAlertMessage(null), 3000);
  };

  return (
    <div className="content-section">
      <div className="content-header">
        <h2>FAQ Management</h2>
        <button 
          className="add-button"
          onClick={() => setIsModalOpen(true)}
        >
          Add New FAQ
        </button>
      </div>
      
      {alertMessage && (
        <div className={`alert ${alertMessage.type}`}>
          {alertMessage.message}
        </div>
      )}
      
      <div className="admin-faq-list">
        {faqs.map(faq => (
          <div key={faq.faq_id} className="admin-faq-item">
            <div className="admin-faq-content">
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
            <button 
              className="faq-delete-button"
              onClick={() => handleDeleteFAQ(faq.faq_id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <AddFAQModal 
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddFAQ}
        />
      )}
    </div>
  );
};

export default FAQManagement;