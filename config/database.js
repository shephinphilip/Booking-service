const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('booking-db', 'postgres', 'Shephin@123', {
  host: 'localhost',
  dialect: 'postgres',
});

// Test the database connection
async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync models with the database
    await sequelize.sync();
    console.log('Models synchronized with the database.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

// Call the function to test the database connection
testDatabaseConnection();

module.exports = sequelize;
