const express = require('express');
const router = express.Router();
const Seat = require('../models/seat');
const SeatPricing = require('../models/pricing');
const calculatePricing = require('../utils/pricing');

// GET /seats
router.get('/', async (req, res) => {
  try {
    // Retrieve all seats and include the associated SeatPricing
    const seats = await Seat.findAll({
      include: {
        model: SeatPricing,
        attributes: ['minPrice', 'normalPrice', 'maxPrice'],
      },
    });
    res.json(seats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /seats/:id
router.get('/:id', async (req, res) => {
  try {
    const seatId = req.params.id;

    // Retrieve the seat by ID and include the associated SeatPricing
    const seat = await Seat.findByPk(seatId, {
      include: {
        model: SeatPricing,
        attributes: ['minPrice', 'normalPrice', 'maxPrice'],
      },
    });

    if (!seat) {
      return res.status(404).json({ error: 'Seat not found' });
    }

    // Get the seat class and calculate the percentage of seats booked
    const seatClass = seat.seatClass;
    const allSeatsOfClass = await Seat.findAll({ where: { seatClass } });
    const totalSeatsOfClass = allSeatsOfClass.length;
    const bookedSeatsOfClass = allSeatsOfClass.filter(seat => seat.isBooked).length;
    const percentageBooked = (bookedSeatsOfClass / totalSeatsOfClass) * 100;

    // Retrieve the pricing data for the seat class
    const pricingData = seat.SeatPricing;

    // Calculate the pricing based on the percentage of seats booked
    const pricing = calculatePricing(percentageBooked, seatClass, pricingData);

    res.json({ seat, pricing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
