require('dotenv').config();
const express = require('express');
const { default: mongoose } = require('mongoose');
const connectDb = require('../db/connect');
const userRoute = require('./routes/userRoutes');
const authRoute = require('./routes/authRoute');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const connect = connectDb(process.env.MongoDbUri);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Invalid Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
})
