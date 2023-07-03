const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Pricing = require('./pricing');
const csv = require('csv-parser');
const fs = require('fs');

const Seat = sequelize.define(
  'Seat',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    seatIdentifier: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seatClass: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    minPrice: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    normalPrice: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    maxPrice: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    isBooked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
    tableName: 'seats',
  }
);

Seat.belongsTo(Pricing, { foreignKey: 'seatClass', targetKey: 'seatClass' });

Seat.addHook('beforeCreate', async (seat) => {
  const pricing = await Pricing.findOne({
    where: {
      seatClass: seat.seatClass,
    },
  });

  if (pricing) {
    seat.minPrice = pricing.minPrice;
    seat.normalPrice = pricing.normalPrice;
    seat.maxPrice = pricing.maxPrice;
  }
});

const insertData = async () => {
  try {
    const results = [];
    const pricingMap = new Map();

    const pricingData = await Pricing.findAll();
    pricingData.forEach((pricing) => {
      pricingMap.set(pricing.seatClass, {
        minPrice: pricing.minPrice,
        normalPrice: pricing.normalPrice,
        maxPrice: pricing.maxPrice,
      });
    });

    fs.createReadStream('./data/Seats - MOCK_DATA.csv')
      .pipe(csv())
      .on('data', (data) => {
        const transformedData = {
          seatIdentifier: data.seat_identifier,
          seatClass: data.seat_class,
          minPrice: 0.0,
          normalPrice: 0.0,
          maxPrice: 0.0,
        };

        if (pricingMap.has(data.seat_class)) {
          const pricing = pricingMap.get(data.seat_class);
          transformedData.minPrice = pricing.minPrice;
          transformedData.normalPrice = pricing.normalPrice;
          transformedData.maxPrice = pricing.maxPrice;
        }

        results.push(transformedData);
      })
      .on('end', async () => {
        await Seat.bulkCreate(results);
        console.log('Seats table created and data inserted successfully');
      });
  } catch (error) {
    console.error('Error inserting data into the seats table:', error);
  }
};

insertData();

module.exports = Seat;
