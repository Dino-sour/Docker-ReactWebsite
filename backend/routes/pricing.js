const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get all pricing information
router.get('/', async (req, res) => {
  try {
    const [dealResults] = await pool.query('SELECT * FROM DealPricing');
    const [tableResults] = await pool.query('SELECT * FROM TablePricing');
    
    res.json({
      deals: dealResults,
      tables: tableResults
    });
  } catch (error) {
    console.error('Error fetching pricing:', error);
    res.status(500).json({ error: 'Failed to fetch pricing information' });
  }
});

// Update deal pricing
router.put('/deal/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;
    
    await pool.query(
      'UPDATE DealPricing SET price = ? WHERE id = ?',
      [price, id]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating deal price:', error);
    res.status(500).json({ error: 'Failed to update deal price' });
  }
});

// Update table pricing
router.put('/table/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;
    
    await pool.query(
      'UPDATE TablePricing SET price = ? WHERE id = ?',
      [price, id]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating table price:', error);
    res.status(500).json({ error: 'Failed to update table price' });
  }
});

module.exports = router;