const mongoose = require('mongoose');

module.exports = () => {
    const connectionParams = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    try {
        mongoose.connect(process.env.DB, connectionParams);
        console.log('Successfully connected to the database');
    } catch (error) {
        console.log('Failed to connect to the database');
        console.log(error);
    }
}