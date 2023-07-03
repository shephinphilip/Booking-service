# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the project files to the working directory
COPY . .

# Build the project
RUN npm run build

# Expose a port if your application listens on a specific port
EXPOSE 3000

# Define the command to run your application
CMD ["npm", "start"]
