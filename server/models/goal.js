const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    
    text: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Goal', goalSchema);