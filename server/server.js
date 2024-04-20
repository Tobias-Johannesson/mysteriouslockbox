require('dotenv').config();
const http = require('http');
const https = require('https');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();

// CORS options
const corsOptions = {
  origin: process.env.CORS_ORIGIN, // Allow only your React app domain, adjust as needed
  optionsSuccessStatus: 200,
  methods: "GET, POST, PUT, DELETE"
};

app.use((req, res, next) => {
  if (req.secure || process.env.NODE_ENV === 'development') {
    next();
  } else {
    res.redirect(`https://${req.headers.host}${req.url}`);
  }
});
app.use(cors(corsOptions));
app.use(express.json()); // Middleware to parse JSON bodies

// Endpoint to fetch data
app.get('/api/keys', async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM keys;");
        res.status(200).json(rows);
    } catch (error) {
        console.error('Failed to fetch keys:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint to input data
app.post('/api/unlock', async (req, res) => {
    const { keyId } = req.body; // Adjusted to keyId to match the client-side code
    try {
        const { rows } = await pool.query("UPDATE keys SET unlocked = true WHERE id = $1 RETURNING *;", [keyId]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).send('Key not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Start HTTP or HTTPS server based on the environment
if (process.env.NODE_ENV === 'production') {
  const options = {
      key: fs.readFileSync(process.env.SSL_KEY_PATH),
      cert: fs.readFileSync(process.env.SSL_CERT_PATH),
      ca: fs.readFileSync(process.env.SSL_CA_PATH)
  };
  https.createServer(options, app).listen(443, () => {
      console.log('HTTPS server running on port 443');
  });
} else {
  http.createServer(app).listen(3001, () => {
      console.log('HTTP server running on port 3001');
  });
}