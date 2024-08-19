require('dotenv').config();
const express = require('express');
const { default: mongoose } = require('mongoose');
const connectDb = require('../db/connect');

const app = express();
const PORT = process.env.PORT || 3000;

const connect = connectDb(process.env.MongoDbUri);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});