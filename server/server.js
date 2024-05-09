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

app.get('/api/riddles/first-locked', async (req, res) => {
    try {
        const { rows } = await pool.query("SELECT id, riddle, unlocked FROM riddles WHERE unlocked = false ORDER BY id ASC LIMIT 1;");
        if (rows.length > 0) {
            res.status(200).json(rows[0]); // Send the riddle with the smallest id
        } else {
            res.status(404).json({ error: 'No unlocked riddles available'}); // Handle case where no riddles are in the database
        }
    } catch (error) {
        console.error('Failed to fetch the first unlocked riddle:', error);
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

// Load previous gratitudes
app.get('/api/gratitudes', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM gratitudes ORDER BY submitted_at DESC');
        const lastSubmission = rows[0] ? new Date(rows[0].submitted_at).getTime() : null;
        
        // Calculate time difference and hours since the last submission
        const now = new Date().getTime();
        const timeDiff = lastSubmission ? (now - lastSubmission) : null;
        let hoursSinceLast = timeDiff ? Math.floor(timeDiff / (1000 * 60 * 60)) : null;
    
        // Default hours since last submission if no entries are found
        if (hoursSinceLast === null) {
            hoursSinceLast = 48; // Consider first submission to be 48 hours ago if no records
        }

        // Calculate hours to next submission using Math.ceil() for more accuracy on countdown
        let hoursToNext = 24 - hoursSinceLast;
        if (hoursSinceLast >= 24) {
            hoursToNext = 0;
        } else if (lastSubmission) {
            // Rounding up to account for part of the last hour
            hoursToNext = Math.ceil((86400000 - timeDiff) / (1000 * 60 * 60));
        }

        console.log('Gratitudes:', rows);

        res.status(200).json({
            count: rows.length,
            canSubmit: hoursSinceLast >= 24,
            hoursToNext: Math.max(0, 24 - hoursSinceLast), // Ensure no negative values
            gratitudes: rows
        });
    } catch (error) {
        console.error('Error fetching gratitudes:', error);
        res.status(500).send('Server error: ' + error.message);
    }
});
  
// Endpoint to input gratitude
app.post('/api/gratitudes', async (req, res) => {
    const content = req.body.content;
    if (typeof content !== 'string' || content.trim().length === 0) {
        return res.status(400).json({ message: "Content must be a non-empty string." });
    }

    let difference;

    try {
        const result = await pool.query('SELECT submitted_at FROM gratitudes ORDER BY submitted_at DESC LIMIT 1');
        const lastSubmission = result.rows[0] ? new Date(result.rows[0].submitted_at) : null;
        const now = new Date();
        
        // Calculate difference in milliseconds
        difference = lastSubmission ? (now.getTime() - lastSubmission.getTime()) : null;
    } catch (error) {
        console.error('Error getting previous gratitude:', error);
        return res.status(500).send('Error getting previous gratitude: ' + error.message);
    }

    if (difference !== null && difference < 86400000) { // 86400000 ms = 24 hours
        return res.status(403).json({ message: "You can only submit one gratitude every 24 hours" });
    }
  
    try {
        const submittedAt = new Date().toISOString(); // Correctly format the timestamp
        await pool.query('INSERT INTO gratitudes (content, submitted_at) VALUES ($1, $2)', [content, submittedAt]);
        res.status(201).json({ message: 'Gratitude submitted successfully' });
    } catch (error) {
        console.error('Error submitting gratitude:', error);
        res.status(500).send('Error submitting gratitude: ' + error.message);
    }
});
  

app.listen(3001, () => console.log('Express server is running on port 3001'));