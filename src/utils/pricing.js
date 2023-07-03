// utils/pricing.js
const { getSeatPricingByClass } = require('./seatPricingData');

function calculatePricing(percentage, seatClass) {
  let pricing;

  if (percentage < 40) {
    pricing = 'minPrice';
  } else if (percentage >= 40 && percentage <= 60) {
    pricing = 'normalPrice';
  } else {
    pricing = 'maxPrice';
  }

  const seatClassPricing = getSeatPricingByClass(seatClass);

  if (!seatClassPricing || !seatClassPricing[pricing]) {
    // If seat class pricing or the specific pricing value is not available,
    // choose the next available pricing value
    pricing = 'normalPrice';
  }

  return seatClassPricing ? seatClassPricing[pricing] : null;
}

module.exports = calculatePricing;
