const Booking = require('../src/models/booking');

// Function to update the total amount of a booking
const updateTotalAmount = async (bookingId, totalAmount) => {
  try {
    const booking = await Booking.findByPk(bookingId);
    if (booking) {
      booking.totalPrice = totalAmount;
      await booking.save();
      console.log('Total amount updated successfully.');
    } else {
      console.log('Booking not found.');
    }
  } catch (error) {
    console.error('Error updating total amount:', error);
  }
};

module.exports = updateTotalAmount;
