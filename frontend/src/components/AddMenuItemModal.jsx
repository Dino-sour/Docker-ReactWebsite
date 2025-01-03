import React, { useState } from 'react';

const AddMenuItemModal = ({ onClose, onSubmit, menuTypes }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    type: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert price to number and validate
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      alert('Please enter a valid price');
      return;
    }

    onSubmit({
      ...formData,
      price: price.toFixed(2)
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Menu Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Item Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Category:</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              {menuTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="modal-buttons">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItemModal;