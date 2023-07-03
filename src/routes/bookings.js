const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Seat = require('../models/seat');
const calculatePricing = require('../utils/pricing');
const sgMail = require('@sendgrid/mail');

// Configure SendGrid API key
sgMail.setApiKey('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');

// POST /bookings
router.post('/', async (req, res) => {
  try {
    const { seatIds, name, Email } = req.body;
    if (!seatIds || !name || !Email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if any of the requested seats are already booked
    const bookedSeats = await Seat.findAll({
      where: { id: seatIds, isBooked: true },
    });
    if (bookedSeats.length > 0) {
      return res.status(400).json({ error: 'One or more seats are already booked' });
    }

    // Calculate the pricing for the selected seats
    let totalPrice = 0;
    for (const seatId of seatIds) {
      const seat = await Seat.findOne({ where: { id: seatId } });
      const percentageBooked = (seat.bookedSeats / seat.totalSeats) * 100;
      const pricing = calculatePricing(percentageBooked, seat.seatClass);
      if (pricing === null) {
        return res.status(500).json({ error: 'Failed to calculate pricing' });
      }
      totalPrice += pricing;
    }

    // Create the booking
    const booking = await Booking.create({
      seatIds: req.body.seatIds,
      name: req.body.name,
      Email: req.body.Email,
      totalPrice: totalPrice.toFixed(2),
    });

    // Update the isBooked status for the selected seats
    await Seat.update({ isBooked: true }, { where: { id: seatIds } });

    // Send email using SendGrid
    const msg = {
      to: Email,
      from: 'shephinphilip@gmail.com',
      subject: 'Booking Confirmation',
      text: 'Your booking has been confirmed. Booking ID: ' + booking.id,
    };
    await sgMail.send(msg);

    return res.json({ bookingId: booking.id, totalAmount: booking.totalPrice });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /bookings
router.get('/', async (req, res) => {
  try {
    const { userIdentifier } = req.query;

    if (!userIdentifier) {
      return res.status(400).json({ error: 'User identifier is required' });
    }

    // Retrieve bookings based on the Email
    const bookings = await Booking.findAll({
      where: { Email: userIdentifier },
    });

    return res.json(bookings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
