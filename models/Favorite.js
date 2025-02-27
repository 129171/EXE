const mongoose = require('mongoose');
const favoriteSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    sound: { type: mongoose.Schema.Types.ObjectId, ref: 'Sound', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    total: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    status: { type: String, enum: ['completed', 'returned', 'cancelled'], required: true }
});

module.exports = mongoose.model('Favorite', favoriteSchema);