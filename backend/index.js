const express = require('express');
const cors = require('cors');
const faqRoutes = require('./routes/faq');
const teamRoutes = require('./routes/teams');
const contactRoutes = require('./routes/contact');
const playerRoutes = require('./routes/players');
const menuRoutes = require('./routes/menu');
const pricingRoutes = require('./routes/pricing');
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Added PUT to allowed methods
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!',
    time: new Date().toISOString()
  });
});

// Routes
app.use('/api/faqs', faqRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/pricing', pricingRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const port = process.env.BACKEND_PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('Environment:', {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    backend_port: port
  });
});