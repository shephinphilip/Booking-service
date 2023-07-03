const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Booking = require('../models/booking');
const Seat = require('../models/seat');
const calculatePricing = require('../utils/pricing');
const sgMail = require('@sendgrid/mail');

// Set your SendGrid API key
const SENDGRID_API_KEY = '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';
sgMail.setApiKey(SENDGRID_API_KEY);

// POST /bookings
router.post('/', [
  body('seatIds').notEmpty().isArray().withMessage('SeatIds must be a non-empty array'),
  body('name').notEmpty().withMessage('Name is required'),
  body('email').notEmpty().isEmail().withMessage('Valid email is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { seatIds, name, email } = req.body;

    // Check if any of the requested seats are already booked
    const bookedSeats = await Seat.findAll({
      where: { id: seatIds, isBooked: true },
    });
    if (bookedSeats.length > 0) {
      res.status(400).json({ error: 'One or more seats are already booked' });
      return;
    }

    // Calculate the pricing for the selected seats
    let totalPrice = 0;
    for (const seatId of seatIds) {
      const seat = await Seat.findOne({ where: { id: seatId } });
      const percentageBooked = (seat.bookedSeats / seat.totalSeats) * 100;
      const pricing = calculatePricing(percentageBooked, seat.seatClass);
      if (pricing === null) {
        res.status(500).json({ error: 'Failed to calculate pricing' });
        return;
      }
      totalPrice += pricing;
    }

    // Create the booking
    const booking = await Booking.create({
      seatIds: seatIds,
      name: name,
      email: email,
      totalPrice: totalPrice.toFixed(2),
    });

    // Update the isBooked status for the selected seats
    await Seat.update({ isBooked: true }, { where: { id: seatIds } });

    // Send confirmation email using SendGrid
    const msg = {
      to: email,
      from: 'shephinphilip786@gmail.com', // Replace with your email address
      subject: 'Booking Confirmation',
      text: `Your booking has been confirmed. Booking ID: ${booking.id}, Total Amount: ${booking.totalPrice}`,
    };

    await sgMail.send(msg);

    res.json({ bookingId: booking.id, totalAmount: booking.totalPrice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /bookings
router.get('/', async (req, res) => {
  try {
    const { userIdentifier } = req.query;

    if (!userIdentifier) {
      res.status(400).json({ error: 'User identifier is required' });
      return;
    }

    // Retrieve bookings based on the email
    const bookings = await Booking.findAll({
      where: { email: userIdentifier },
    });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
