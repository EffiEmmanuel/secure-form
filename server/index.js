require('dotenv').config({path: __dirname + '/.env'})

const express = require('express');
const app = express();
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const connection = require('./config/db');


// DATABASE CONNECTION
connection();

// MIDDLEWARE
app.use(express.urlencoded({extended: false }));
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use(express.json);
app.use(cors());


const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})