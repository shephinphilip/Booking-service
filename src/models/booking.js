const { Sequelize, Model } = require('sequelize');
const sequelize = require('../../config/database');

class Booking extends Model {}

Booking.init(
  {
    id: {
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true,
    },
    seatIds: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
    },
    name: {
      type: Sequelize.STRING,
    },
    Email: {
      type: Sequelize.STRING,
    },
    totalPrice: {
      type: Sequelize.DECIMAL(10, 2),
      defaultValue: 0.0, // Set a default value for totalPrice
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    sequelize,
    modelName: 'booking',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  }
);

module.exports = Booking;
