# Booking Service

This project is a Booking Service that allows users to choose seats and make bookings. It is built using the following technology stack:

- Node.js framework Express.js
- Sequelize ORM for database queries
- Postgres as the data store
- Docker for containerization

## API Specifications

The Booking Service provides the following APIs:

1. **Get All Seats**

   `GET /seats`
   
   This API returns all the seats available, ordered by the seat class. It also includes a boolean flag `is_booked` to indicate whether a seat is booked or not.

2. **Get Seat Pricing**

   `GET /seats/:id`
   
   This API returns the seat details along with the pricing based on the seat class and the number of bookings made for that seat class. The pricing is determined as follows:
   - If less than 40% of seats are booked, the minimum price is used. If the minimum price is not available, the normal price is used.
   - If 40% to 60% of seats are booked, the normal price is used. If the normal price is not available, the maximum price is used.
   - If more than 60% of seats are booked, the maximum price is used. If the maximum price is not available, the normal price is used.

3. **Create Booking**

   `POST /bookings`
   
   This API allows users to create a booking by providing an array of seat ids to be booked, along with the user's name and phone number. It checks if the chosen seats are available and not already booked. Upon successful booking, it returns the booking ID and the total amount of the booking.

4. **Retrieve Bookings**

   `GET /bookings?userIdentifier=<email or phone number>`
   
   This API retrieves all the bookings created by a user based on their email or phone number. It searches for bookings using the provided user identifier. If no user identifier is provided, it returns an error.

## Bonus Features

In addition to the core functionality, the Booking Service also includes the following bonus features:

1. **Notification Integration**

   The service is integrated with a notification system to send out booking confirmation notifications via email or SMS. Third-party service providers like Twilio, Sendgrid, or Textlocal can be used for this purpose.

2. **Default Data Upload Script**

   The project includes a script to upload default data to the database by reading a CSV file. This script can be used to populate the seats and their pricing information initially.

## Usage

To use the Booking Service, you can make requests to the provided API endpoints using a REST client such as Postman. You can refer to the Postman collection for the available API endpoints and their respective request formats.

## Testing

You can test the Booking Service by sending requests to the API endpoints using a REST client like Postman. The Postman collection provided includes preconfigured requests for each API endpoint, allowing you to easily test the functionality of the service.

## Deployment

To deploy the Booking Service, you can containerize it using Docker. The project includes a Dockerfile that sets up the necessary dependencies and configurations. You can build the Docker image and run the container using the following commands:

```bash
docker build -t booking-service .
docker run -p 3000:3000 -d booking-service
```

The service will be accessible on `http://localhost:3000` after running the container.

## Conclusion

The Booking Service is a fully functional application that allows users to choose seats and make bookings. It is built using Node.js, Express.js, and Sequelize, with data stored in a Postgres database. The service can be easily deployed using Docker and tested using a REST client like Post

man. The bonus features of notification integration and default data upload script provide additional functionality and flexibility.
