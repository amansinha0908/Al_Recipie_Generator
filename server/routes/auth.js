const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();
const sign = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'recipai_secret', { expiresIn: '7d' });

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already in use' });

    const user = await User.create({ name, email, password });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, token: sign(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ _id: user._id, name: user.name, email: user.email, dietaryPreferences: user.dietaryPreferences, allergies: user.allergies, token: sign(user._id) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get profile
router.get('/me', protect, (req, res) => res.json(req.user));

// Update preferences
router.put('/preferences', protect, async (req, res) => {
  try {
    const { dietaryPreferences, allergies } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { dietaryPreferences, allergies },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;