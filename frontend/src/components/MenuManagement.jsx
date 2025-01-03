import React, { useState, useEffect } from 'react';
import AddMenuItemModal from './AddMenuItemModal';
import EditMenuItemModal from './EditMenuItemModal';
import './MenuManagement.css';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState('all');
  const [alertMessage, setAlertMessage] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  const menuTypes = [
    'Appetizers',
    'BurgersAndSandwiches',
    'AllDayBreakfast',
    'Salads'
  ];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/menu');
      if (!response.ok) throw new Error('Failed to fetch menu items');
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      showAlert('error', 'Failed to fetch menu items');
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/menu/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete item');
        
        fetchMenuItems();
        showAlert('success', 'Menu item deleted successfully');
      } catch (error) {
        showAlert('error', 'Failed to delete menu item');
      }
    }
  };

  const showAlert = (type, message) => {
    setAlertMessage({ type, message });
    setTimeout(() => setAlertMessage(null), 3000);
  };

  const filterMenuItems = (items) => {
    if (selectedType === 'all') return items;
    return items.filter(item => item.type === selectedType);
  };

  const handleAddItem = async (newItem) => {
    try {
      const response = await fetch('http://localhost:5000/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });
  
      if (!response.ok) throw new Error('Failed to add item');
      
      setShowAddModal(false);
      fetchMenuItems();
      showAlert('success', 'Menu item added successfully');
    } catch (error) {
      showAlert('error', 'Failed to add menu item');
    }
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };
  
  // This function handles the API update
  const handleEditItem = async (updatedItem) => {
    try {
      const response = await fetch(`http://localhost:5000/api/menu/${updatedItem.item_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
      });
  
      if (!response.ok) throw new Error('Failed to update item');
      
      setShowEditModal(false);
      setSelectedItem(null);
      fetchMenuItems();
      showAlert('success', 'Menu item updated successfully');
    } catch (error) {
      showAlert('error', 'Failed to update menu item');
    }
  };

  return (
    <div className="content-section">
      <div className="content-header">
        <h2>Menu Management</h2>
        <div className="header-controls">
          <select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="type-filter"
          >
            <option value="all">All Categories</option>
            {menuTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <button 
            className="add-button"
            onClick={() => setShowAddModal(true)}
          >
            Add Menu Item
          </button>
        </div>
      </div>

      {alertMessage && (
        <div className={`alert ${alertMessage.type}`}>
          {alertMessage.message}
        </div>
      )}

      <div className="menu-items-grid">
        {filterMenuItems(menuItems).map(item => (
          <div key={item.item_id} className="menu-item-card">
            <div className="menu-item-content">
              <h3>{item.name}</h3>
              <p className="item-description">{item.description}</p>
              <p className="item-price">${Number(item.price).toFixed(2)}</p>
              <p className="item-category">{item.type}</p>
            </div>
            <div className="menu-item-actions">
            <button 
                className="edit-button"
                onClick={() => handleEditClick(item)} 
                >
                Edit
                </button>
              <button 
                className="delete-button"
                onClick={() => handleDeleteItem(item.item_id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <AddMenuItemModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddItem}
          menuTypes={menuTypes}
        />
      )}

      {showEditModal && (
        <EditMenuItemModal
          item={selectedItem}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditItem}
          menuTypes={menuTypes}
        />
      )}
    </div>
  );
};

export default MenuManagement;