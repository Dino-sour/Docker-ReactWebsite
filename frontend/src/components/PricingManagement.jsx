import React, { useState, useEffect } from 'react';
import './PricingManagement.css';

const PricingManagement = () => {
  const [pricing, setPricing] = useState({
    dealPricing: [],
    tablePricing: [],
    loading: true,
    error: null
  });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/pricing');
      if (!response.ok) throw new Error('Failed to fetch pricing');
      const data = await response.json();
      setPricing(prevState => ({
        ...prevState,
        dealPricing: data.deals,
        tablePricing: data.tables,
        loading: false
      }));
    } catch (error) {
      setPricing(prevState => ({
        ...prevState,
        error: 'Error loading pricing information',
        loading: false
      }));
    }
  };

  const handlePriceUpdate = async (type, id, newPrice) => {
    try {
      const response = await fetch(`http://localhost:5000/api/pricing/${type}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price: newPrice }),
      });

      if (!response.ok) throw new Error('Failed to update price');

      setMessage({
        type: 'success',
        text: 'Price updated successfully'
      });
      fetchPricing();
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message
      });
    }
  };

  if (pricing.loading) {
    return <div className="management-loading">Loading pricing information...</div>;
  }

  return (
    <div className="pricing-management">
      <div className="management-section">
        <h2>All Day Pool Deal Pricing</h2>
        <div className="price-items">
          {pricing.dealPricing.map((deal, index) => (
            <div key={index} className="price-item">
              <span className="item-name">{deal.tableType}</span>
              <div className="price-input-group">
                <span className="currency">$</span>
                <input
                  type="number"
                  value={deal.price}
                  onChange={(e) => handlePriceUpdate('deal', deal.id, e.target.value)}
                  step="0.01"
                />
                <span className="price-label">per person</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="management-section">
        <h2>Regular Pool Pricing</h2>
        <div className="price-items">
          {pricing.tablePricing.map((price, index) => (
            <div key={index} className="price-item">
              <span className="item-name">{price.tableType}</span>
              <div className="price-input-group">
                <span className="currency">$</span>
                <input
                  type="number"
                  value={price.price}
                  onChange={(e) => handlePriceUpdate('table', price.id, e.target.value)}
                  step="0.01"
                />
                <span className="price-label">per hour</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default PricingManagement;