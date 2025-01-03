import React, { useState } from 'react';
import './AddFAQModal.css';

const AddFAQModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New FAQ</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="question">Question:</label>
            <input
              type="text"
              id="question"
              name="question"
              value={formData.question}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="answer">Answer:</label>
            <textarea
              id="answer"
              name="answer"
              value={formData.answer}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-buttons">
            <button type="button" className="faq-cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="faq-submit-button">
              Add FAQ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFAQModal;