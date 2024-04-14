require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432  // Default PostgreSQL port
});

const app = express();
app.use(cors({
  origin: 'http://localhost:3000'  // Allow only your React app's domain
}));

app.use(express.json());

app.get('/api/keys', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM keys');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

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
