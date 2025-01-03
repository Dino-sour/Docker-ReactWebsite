// FAQPage.jsx
import React, { useState, useEffect } from 'react';
import FAQItem from './FAQItem';
import ContactSection from './ContactSection';
import './FAQ.css';

const FAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/faqs');
      if (!response.ok) throw new Error('Failed to fetch FAQs');
      const data = await response.json();
      setFaqs(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching FAQs:', err);
    }
  };

  if (error) {
    return (
      <div className="faq-page">
        <div className="faq-container">
          <h1 className="faq-title">Error loading FAQs</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="faq-page">
      <div className="faq-container">
        <h1 className="faq-title">Frequently Asked Questions</h1>
        <div className="faq-list">
          {faqs.map((faq) => (
            <FAQItem key={faq.faq_id} faq={faq} />
          ))}
        </div>
        <ContactSection />
      </div>
    </div>
  );
};

export default FAQPage;