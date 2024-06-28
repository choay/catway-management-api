const express = require('express');
const router = express.Router();
const Catway = require('../models/catway');
const Reservation = require('../models/reservation');
const { body, validationResult } = require('express-validator');
const authenticateToken = require('../middleware/authenticate');

// Middleware pour l'authentification
router.use(authenticateToken);

// GET all catways
router.get('/', async (req, res) => {
  try {
    const catways = await Catway.find();
    res.json(catways);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific catway
router.get('/:id', async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    if (!catway) return res.status(404).json({ message: 'Catway not found' });
    res.json(catway);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new catway
router.post('/', async (req, res) => {
  const catway = new Catway({
    catwayNumber: req.body.catwayNumber,
    type: req.body.type,
    catwayState: req.body.catwayState,
  });
  try {
    const newCatway = await catway.save();
    res.status(201).json(newCatway);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (replace) a specific catway
router.put('/:id', async (req, res) => {
  try {
    const catway = await Catway.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!catway) return res.status(404).json({ message: 'Catway not found' });
    res.json(catway);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH (update part) a specific catway
router.patch('/:id', async (req, res) => {
  try {
    const catway = await Catway.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!catway) return res.status(404).json({ message: 'Catway not found' });
    res.json(catway);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a specific catway
router.delete('/:id', async (req, res) => {
  try {
    const catway = await Catway.findByIdAndDelete(req.params.id);
    if (!catway) return res.status(404).json({ message: 'Catway not found' });
    res.json({ message: 'Catway deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all reservations for a specific catway
router.get('/:id/reservations', async (req, res) => {
  try {
    const reservations = await Reservation.find({ catwayNumber: req.params.id });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific reservation
router.get('/:id/reservations/:idReservation', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.idReservation);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new reservation
router.post('/:id/reservations', async (req, res) => {
  const reservation = new Reservation({
    catwayNumber: req.params.id,
    clientName: req.body.clientName,
    boatName: req.body.boatName,
    checkIn: req.body.checkIn,
    checkOut: req.body.checkOut,
  });
  try {
    const newReservation = await reservation.save();
    res.status(201).json(newReservation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a specific reservation
router.delete('/:id/reservations/:idReservation', async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.idReservation);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    res.json({ message: 'Reservation deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
