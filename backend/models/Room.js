const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNumber: { type: String, required: true, unique: true },
    type: { type: String, enum: ['AC', 'Non-AC'], required: true },
    category: { type: String, enum: ['Standard', 'Deluxe', 'Suite', 'Family'], default: 'Standard' },
    description: String,
    price: { type: Number, required: true },
    capacity: { type: Number, default: 2 },
    amenities: [String],
    images: [String],
    isAvailable: { type: Boolean, default: true },
    packages: [{
        name: String,
        description: String,
        price: Number,
        includes: [String]
    }]
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);