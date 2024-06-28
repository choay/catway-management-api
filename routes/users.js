const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');


router.get('/register', (req, res) => {
  res.render('register');
});
// Register
router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 5 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});
// Login
router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ message: 'Cannot find user' });

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET);
      res.json({ accessToken });
    } else {
      res.status(403).json({ message: 'Not allowed' });
    }
  } catch {
    res.status(500).json({ message: err.message });
  }
});
router.get('/dashboard', (req, res) => {
  
  res.render('dashboard', { user: req.user });
});

router.get('/', (req, res) => {
  res.render('index');
});



module.exports = router;
