const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple test route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Sudu Araliya backend is running' });
});

const testRoutes = require('./routes/testRoutes');
app.use('/api/test', testRoutes);


module.exports = app;
