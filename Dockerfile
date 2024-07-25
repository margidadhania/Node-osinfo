# Use an official Node.js runtime as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install
RUN npm install express
RUN npm install morgan
#RUN npm install body-parser

# Copy package.json and package-lock.json to the working directsnodeory
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Command to run your application
CMD ["node", "index.js"]
