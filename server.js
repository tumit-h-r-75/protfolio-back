
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({

    origin: [
        'http://localhost:5173',
        'https://my-protfolio-tumit.web.app',
        'https://tumit.tech',
        'https://www.tumit.tech'
    ],
    optionsSuccessStatus: 200
}));

// Middleware
app.use(express.json());

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        console.error('Full MongoDB connection error object:', err);
        process.exit(1); // Exit process with failure
    });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error after initial connection:'));


// Basic Routes
app.get('/', (req, res) => {
    res.send('Portfolio Backend API is running...');
});

// API Routes (to be created)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/media', require('./routes/media'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
