// src/server.js

const express = require('express');
const app = express();
const sequelize = require('../config/database');
const seatsRouter = require('./routes/seats');
const bookingsRouter = require('./routes/bookings');

// Configure body parser middleware
app.use(express.json());

// Mount routers
app.use('/seats', seatsRouter);
app.use('/bookings', bookingsRouter);

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
