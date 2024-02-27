// Import required modules
const express = require('express');
const os = require('os');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser'); // Importing the body-parser middleware for parsing incoming request bodies
const morgan = require('morgan'); //HTTP request logger middleware. used for the request, error, time and many more
const {
  getIPAddress,
  getMemoryUsage,
  getStorageUsage,
  getCPUUsage,
} = require('./logic');
const { request } = require('http');

// Create Express app and Define port for the server to listen on
const app = express();
const PORT = process.env.PORT || 3000;

morgan.token('method', (req, res) => {
  return req.method;
});

app.use(morgan('dev')); // print morgan(':method :url :status :res[content-length] - :response-time ms')

app.use(morgan(`:method :url`));

//Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to get server information
app.get('/os/server-info', (req, res) => {
  // Construct server information object
  const serverInfo = {
    server: {
      ip: getIPAddress(), // Get server IP address
      hostname: os.hostname(), // Get server hostname
    },
    memory: getMemoryUsage(), // Get memory usage information
    storage: getStorageUsage(), // Get storage usage information
    cpu: {
      used: getCPUUsage(), // Get CPU usage information
    },
  };

  // Send server information as JSON response
  return res.json(serverInfo);
});

// Route to get list of files and directories inside a given path
app.get('/os/directory-list', (req, res) => {
  const path = req.query.path || '/'; // Get path from query parameter or default to root directory

  // Read directory contents
  fs.readdir(path, (err, files) => {
    if (err) {
      // Handle error if reading directory fails
      res.status(500).json({ error: 'Error reading directory' });
    } else {
      // Send list of files as JSON response
      return res.json({ files });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
