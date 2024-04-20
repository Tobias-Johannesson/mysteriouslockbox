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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
