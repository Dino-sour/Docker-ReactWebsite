import React, { useState, useEffect } from 'react';
import './Pricing.css';

const Pricing = () => {
  const [pricing, setPricing] = useState({
    dealPricing: [],
    tablePricing: [],
    loading: true,
    error: null
  });

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

  const formatPrice = (price) => {
    const numPrice = Number(price);
    return !isNaN(numPrice) ? `$${numPrice.toFixed(2)}` : 'Price not available';
  };

  if (pricing.loading) {
    return <div className="pricing-loading">Loading pricing information...</div>;
  }

  if (pricing.error) {
    return <div className="pricing-error">{pricing.error}</div>;
  }

  return (
    <div className="pricing-page">
      <div className="pricing-header">
        <h1>Pool Pricing & Specials</h1>
        <p>Pool tables are available all day every day from 11 am – 2 am</p>
      </div>

      <div className="pricing-grid-container">
        {/* Grid Item 1: Available Tables */}
        <section className="pricing-section">
          <h2>Available Tables</h2>
          <div className="tables-list">
            <div className="table-info">
              <p className="table-count">2 Tables</p>
              <p className="table-type">7ft Valley Tables</p>
            </div>
            <div className="table-info">
              <p className="table-count">8 Tables</p>
              <p className="table-type">7ft Diamond Tables</p>
            </div>
            <div className="table-info">
              <p className="table-count">10 Tables</p>
              <p className="table-type">9ft Diamond Tables</p>
            </div>
          </div>
        </section>

        {/* Grid Item 2: All Day Pool Deal */}
        <section className="pricing-section">
          <h2>All Day Pool Deal (per person)</h2>
          <div className="pricing-list">
            {pricing.dealPricing.map((deal, index) => (
              <div key={index} className="price-info">
                <p className="table-type">{deal.tableType}</p>
                <p className="price-amount">{formatPrice(deal.price)}</p>
                <p className="price-unit">per person</p>
              </div>
            ))}
          </div>
        </section>

        {/* Grid Item 3: Regular Pool Pricing */}
        <section className="pricing-section">
          <h2>Regular Pool Pricing (per table)</h2>
          <div className="pricing-list">
            {pricing.tablePricing.map((price, index) => (
              <div key={index} className="price-info">
                <p className="table-type">{price.tableType}</p>
                <p className="price-amount">{formatPrice(price.price)}</p>
                <p className="price-unit">per hour</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <p className="gst-notice">Please note all prices shown above do NOT include GST.</p>
    </div>
  );
};

export default Pricing;