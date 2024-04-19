const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// Endpoint to fetch data
app.get('/api/keys', async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT * FROM keys;");
        console.log("Keys successfully collected!");
        res.json(rows);
    } catch (error) {
        console.error('Failed to fetch keys:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint to input data
app.post('/api/keys', async (req, res) => {
  const { key } = req.body;
  try {
    const { rows } = await pool.query('INSERT INTO keys(key) VALUES($1) RETURNING *', [key]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
