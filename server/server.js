require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();

// CORS options
const corsOptions = {
  origin: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://mysteriouslockbox.com', 
  methods: "GET, POST, PUT, DELETE"
};

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

// Endpoint to fetch a specific riddle by ID
app.get('/api/riddles/:riddleId', async (req, res) => {
    try {
        const riddleId = req.params.riddleId; // Correctly extract riddleId from the route parameter
        const { rows } = await pool.query("SELECT id, riddle FROM riddles WHERE id = $1;", [riddleId]); // Assuming 'riddles' table has a column 'id'
        if (rows.length > 0) {
            res.status(200).json(rows[0]); // Send the first row of the results
        } else {
            res.status(404).send('Riddle not found'); // Handle case where no riddle is found
        }
    } catch (error) {
        console.error('Failed to fetch specific riddle:', error);
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

app.listen(3001, () => console.log('Express server is running on port 3001'));