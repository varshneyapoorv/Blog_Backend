const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/db.js');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const config = require('./config');
const cloudinary = require('cloudinary');
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const bodyParser = require('body-parser')
const morgan = require('morgan');
// rest object
const app = express();

// Connect to MongoDB
connectDB();

// cloudinary config
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true,
})

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(mongoSanitize());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const userRoutes = require('./routes/userRoutes.js');
const blogRoutes = require('./routes/blogRoutes.js');
const commentRoutes = require('./routes/commentRoutes.js')
const categoryRoutes = require('./routes/categoryRoutes.js')
// Routes
app.use('/api/user', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/category', categoryRoutes)


// port
const PORT = process.env.PORT || 3000;

// listen
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${process.env.PORT} on ${process.env.NODE_ENV}`);
});
