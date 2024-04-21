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
        const { rows } = await pool.query("SELECT id, riddle, unlocked FROM riddles WHERE id = $1;", [riddleId]); // Assuming 'riddles' table has a column 'id'
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
            res.status(201).json(rows[0]);
        } else {
            res.status(404).send('Key not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.post('/api/answers', async (req, res) => {
    const { riddleId, answer } = req.body;

    try {
        // Start a database transaction
        await pool.query('BEGIN');

        // Query the riddle and check the answer
        const riddleResult = await pool.query("SELECT * FROM riddles WHERE id = $1;", [riddleId]);
        if (riddleResult.rows.length > 0) {
            const riddle = riddleResult.rows[0];

            if (answer === riddle.answer) {
                // Update riddle to solved
                await pool.query("UPDATE riddles SET unlocked = true WHERE id = $1;", [riddleId]);

                // Update the associated key as obtained
                await pool.query("UPDATE keys SET obtained = true WHERE id = $1;", [riddle.keyid]);

                // Fetch all keys to update the client-side
                const keysResult = await pool.query("SELECT * FROM keys;");
                await pool.query('COMMIT'); // Commit the transaction

                const message = { correct: true, keys: keysResult.rows };
                res.status(200).json(message);
            } else {
                await pool.query('ROLLBACK'); // Rollback the transaction if answer is wrong
                res.status(200).json({ correct: false });
            }
        } else {
            await pool.query('ROLLBACK'); // Rollback the transaction if riddle not found
            res.status(404).send('Riddle not found');
        }
    } catch (error) {
        await pool.query('ROLLBACK'); // Ensure rollback on error
        console.error('Error processing answer:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(3001, () => console.log('Express server is running on port 3001'));