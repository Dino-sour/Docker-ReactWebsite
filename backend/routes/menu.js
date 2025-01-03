const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

// Create the connection pool (we'll refactor this to a separate db config file later)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

// Get all menu items and sort them by type
router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM Food ORDER BY type');
      res.json(rows);
    } catch (err) {
      console.error('Database query error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const { name, description, price, type } = req.body;
      const [result] = await pool.query(
        'INSERT INTO Food (name, description, price, type) VALUES (?, ?, ?, ?)',
        [name, description, price, type]
      );
      res.json({ success: true, id: result.insertId });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });
  
  // Delete menu item
  router.delete('/:id', async (req, res) => {
    try {
      await pool.query('DELETE FROM Food WHERE item_id = ?', [req.params.id]);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const { name, description, price, type } = req.body;
      await pool.query(
        'UPDATE Food SET name = ?, description = ?, price = ?, type = ? WHERE item_id = ?',
        [name, description, price, type, req.params.id]
      );
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

module.exports = router;