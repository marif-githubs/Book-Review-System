const express = require('express');
const connectDB = require('./dbConfig/db');
const router = require('./router/routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// API Routes
app.use('/api/v1', router);

// Test controller
app.get('/', (req, res) => {
    res.send('Welcome to the Book Review System!');
});

// Start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });
});