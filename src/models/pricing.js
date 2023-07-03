const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const seatPricingData = [
  { seatClass: 'A', minPrice: 397.61, normalPrice: 547.20, maxPrice: null },
  { seatClass: 'B', minPrice: 183.44, normalPrice: 441.65, maxPrice: 766.96 },
  { seatClass: 'C', minPrice: 158.47, normalPrice: 449.40, maxPrice: 678.55 },
  { seatClass: 'D', minPrice: 156.15, normalPrice: 263.73, maxPrice: null },
  { seatClass: 'E', minPrice: 274.52, normalPrice: 795.68, maxPrice: null },
  { seatClass: 'F', minPrice: 459.66, normalPrice: 694.75, maxPrice: null },
  { seatClass: 'G', minPrice: 296.21, normalPrice: null, maxPrice: null },
  { seatClass: 'H', minPrice: 477.06, normalPrice: null, maxPrice: null },
  { seatClass: 'I', minPrice: 451.84, normalPrice: 762.14, maxPrice: null },
  { seatClass: 'J', minPrice: 406.24, normalPrice: 868.71, maxPrice: null },
];

const Pricing = sequelize.define(
  'Pricing',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    seatClass: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    minPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    normalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.0,
    },
    maxPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  },
  {
    tableName: 'pricing',
  }
);

// Insert data into the pricing table
const insertData = async () => {
  try {
    await sequelize.sync();
    await Pricing.bulkCreate(seatPricingData);
    console.log('Pricing table created and data inserted successfully');
  } catch (error) {
    console.error('Error inserting data into the pricing table:', error);
  }
};

insertData();

module.exports = Pricing;
