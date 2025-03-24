const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const { MONGO_URI } = require('./config');

const app = express();

app.use(express.json());

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

app.use('/', routes);

module.exports = app;

