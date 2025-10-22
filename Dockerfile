# Use a Node.js base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
# This allows Docker to cache the npm install step if dependencies haven't changed
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your Express app listens on
EXPOSE 5000

# Define the command to run your Express application
CMD ["npm","start"]