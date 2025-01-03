const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

//create the connection pool (we'll refactor this to a separate db config file later)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

//get all FAQs
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM FAQ ORDER BY faq_id DESC');
    res.json(rows);
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ error: err.message });
  }
});

//add new FAQ
router.post('/', async (req, res) => {
  const { question, answer } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO FAQ (question, answer) VALUES (?, ?)',
      [question, answer]
    );
    res.json({ 
      message: 'FAQ added successfully', 
      id: result.insertId 
    });
  } catch (err) {
    console.error('Database insert error:', err);
    res.status(500).json({ error: err.message });
  }
});

//delete FAQ
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM FAQ WHERE faq_id = ?', [req.params.id]);
    res.json({ message: 'FAQ deleted successfully' });
  } catch (err) {
    console.error('Database delete error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;