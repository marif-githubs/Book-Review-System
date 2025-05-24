const express = require('express');
const connectDB = require('./dbConfig/atlasDB.js');
const router = require('./router/routes');
const { handleLogin, handleSignup } = require('./service/authService');
const { verifyToken } = require('./middleware/tokenVerifyMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

app.post('/login', handleLogin);
app.post('/signup', handleSignup);
// API Routes
app.use('/api/v1', verifyToken, router);

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