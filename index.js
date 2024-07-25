// Import required modules
const express = require('express');
const os = require('os');
const fs = require('fs');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const {
  getIPAddress,
  getMemoryUsage,
  getStorageUsage,
  getCPUUsage,
} = require('./logic');

// Create Express app and Define port for the server to listen on
const app = express();
const PORT = process.env.PORT || 5000;

morgan.token('method', (req, res) => {
  return req.method;
});

app.use(morgan('dev'));
app.use(morgan(`:method :url`));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to get server information
app.get('/os/server-info', (req, res) => {
  const serverInfo = {
    server: {https://github.com/Margid2024/express-node-backend.git
      ip: getIPAddress(), // Get server IP address
      hostname: os.hostname(), // Get server hostname
    },
    memory: getMemoryUsage(),
    storage: getStorageUsage(),
    cpu: {
      used: getCPUUsage(),
    },
  };
  return res.json(serverInfo);
});

// Route to get list of files and directories inside a given path
app.get('/os/directory-list', (req, res) => {
  const directoryPath = req.query.path || '/'; // Get path from query parameter or default to root directory

  // Check if the directory exists
  fs.stat(directoryPath, (err, stats) => {
    if (err) {
      return res.status(404).json({ error: 'Directory not found' });
    }
    if (!stats.isDirectory()) {
      return res
        .status(400)
        .json({ error: 'Provided path is not a directory' });
    }

    // Read directory contents
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        res.status(500).json({ error: 'Error reading directory' });
      } else {
        return res.json({ files });
      }
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});