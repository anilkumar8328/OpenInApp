// server.js

// Import required dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const updateTaskPriorityCron = require('./services/service')
const scheduleCall = require('./services/twilio')
const routes = require('./routes/Routes');
const {CustomError,handleErrors} = require('./utils/ErrorHandler')
require('dotenv').config()

// Create an instance of Express
const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoDBUrl = process.env.MONGOOSE_SRV;

mongoose.connect(mongoDBUrl);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to the MongoDB database');
});

app.get('/', (req, res) => {
  res.send('Hello, this is your Express server!');
});


app.use('/api/v1',routes)

app.use(handleErrors)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
