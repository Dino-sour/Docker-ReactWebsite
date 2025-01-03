const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');

//create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
    ciphers:'SSLv3'
  }
});

//create the connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

//test route for SendGrid verification
router.post('/test-email', async (req, res) => {
  try {
    if (!process.env.SMTP_FROM_EMAIL) {
      throw new Error('SMTP_FROM_EMAIL environment variable is not set');
    }

    await transporter.sendMail({
      from: {
        name: "Billiards Club",
        address: process.env.SMTP_FROM_EMAIL
      },
      to: process.env.SMTP_FROM_EMAIL,
      subject: "SendGrid Test Email",
      text: "This is a test email to verify SendGrid integration.",
      html: "<h1>SendGrid Test</h1><p>This is a test email to verify SendGrid integration.</p>"
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

//handle team contact form submissions
router.post('/team', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { teamId, senderName, senderEmail, message } = req.body;

    if (!teamId || !senderName || !senderEmail) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(senderEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    await connection.beginTransaction();

    const [teams] = await connection.query(
      'SELECT name, captain_email FROM Team WHERE team_id = ?',
      [teamId]
    );

    if (teams.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        error: 'Team not found'
      });
    }

    const team = teams[0];

    await connection.query(
      'INSERT INTO ContactRequest (team_id, sender_name, sender_email, message) VALUES (?, ?, ?, ?)',
      [teamId, senderName, senderEmail, message]
    );

    try {
      await transporter.sendMail({
        from: {
          name: "Billiards Club",
          address: process.env.SMTP_FROM_EMAIL
        },
        to: team.captain_email,
        replyTo: senderEmail,
        subject: `New Player Interest - ${team.name}`,
        html: `
          <h2>Someone is interested in joining your team!</h2>
          <p><strong>Name:</strong> ${senderName}</p>
          <p><strong>Email:</strong> ${senderEmail}</p>
          ${message ? `<p><strong>Message:</strong><br>${message}</p>` : ''}
          <p>You can reply directly to this email to contact them.</p>
        `
      });

      await transporter.sendMail({
        from: {
          name: "Billiards Club",
          address: process.env.SMTP_FROM_EMAIL
        },
        to: senderEmail,
        subject: `Contact Request Sent - ${team.name}`,
        html: `
          <h2>Your message has been sent!</h2>
          <p>We've forwarded your contact information to the team captain of ${team.name}. 
          They will contact you directly if they're interested.</p>
          <p>Thank you for your interest!</p>
        `
      });

      await connection.commit();
      res.json({ success: true });

    } catch (emailError) {
      await connection.rollback();
      res.status(500).json({
        success: false,
        error: 'Failed to send email. Please try again later.'
      });
    }

  } catch (error) {
    await connection.rollback();
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred'
    });
  } finally {
    connection.release();
  }
});

//new player contact route
router.post('/player', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const { playerId, senderName, senderEmail, message } = req.body;

    if (!playerId || !senderName || !senderEmail) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(senderEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    await connection.beginTransaction();

    //get player details
    const [players] = await connection.query(
      'SELECT name, email FROM PlayerFinder WHERE player_id = ? AND active = TRUE',
      [playerId]
    );

    if (players.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        error: 'Player not found or profile is inactive'
      });
    }

    const player = players[0];

    try {
      //send email to player
      await transporter.sendMail({
        from: {
          name: "Billiards Club",
          address: process.env.SMTP_FROM_EMAIL
        },
        to: player.email,
        replyTo: senderEmail,
        subject: `Team Finder - New Message from ${senderName}`,
        html: `
          <h2>Someone is interested in connecting!</h2>
          <p><strong>Name:</strong> ${senderName}</p>
          <p><strong>Email:</strong> ${senderEmail}</p>
          ${message ? `<p><strong>Message:</strong><br>${message}</p>` : ''}
          <p>You can reply directly to this email to contact them.</p>
        `
      });

      //send confirmation to sender
      await transporter.sendMail({
        from: {
          name: "Billiards Club",
          address: process.env.SMTP_FROM_EMAIL
        },
        to: senderEmail,
        subject: `Message Sent to ${player.name}`,
        html: `
          <h2>Your message has been sent!</h2>
          <p>We've forwarded your contact information to ${player.name}. 
          They will contact you directly if they're interested in connecting.</p>
          <p>Thank you for using our Team Finder service!</p>
        `
      });

      await connection.commit();
      res.json({ success: true });

    } catch (emailError) {
      await connection.rollback();
      res.status(500).json({
        success: false,
        error: 'Failed to send email. Please try again later.'
      });
    }

  } catch (error) {
    await connection.rollback();
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred'
    });
  } finally {
    connection.release();
  }
});

module.exports = router;