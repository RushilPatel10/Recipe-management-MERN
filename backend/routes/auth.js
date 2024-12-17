const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Login route
router.post('/login', async (req, res) => {
  console.log('Received login request body:', req.body);

  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
        details: { email: !!email, password: !!password }
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      console.log('User not found:', normalizedEmail);
      return res.status(400).json({
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log('Password mismatch for user:', normalizedEmail);
      return res.status(400).json({
        message: 'Invalid email or password'
      });
    }

    // Create token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) {
          console.error('Token generation error:', err);
          return res.status(500).json({
            message: 'Error generating authentication token'
          });
        }

        // Send successful response
        res.json({
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name
          }
        });
      }
    );
  } catch (error) {
    console.error('Server error during login:', error);
    res.status(500).json({
      message: 'Server error during login'
    });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    user = new User({
      name,
      email,
      password
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Create token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify token route
router.get('/verify', auth, (req, res) => {
  res.json({ valid: true });
});

module.exports = router; 