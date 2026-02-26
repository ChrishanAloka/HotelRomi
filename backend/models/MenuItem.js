const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    category: {
        type: String,
        enum: ['Starters', 'Rice & Noodles', 'Curries', 'Grills', 'Desserts', 'Beverages', 'Specials'],
        required: true
    },
    price: { type: Number, required: true },
    image: String,
    isAvailable: { type: Boolean, default: true },
    isVegetarian: { type: Boolean, default: false },
    spiceLevel: { type: String, enum: ['Mild', 'Medium', 'Hot', 'Extra Hot', 'None'], default: 'None' }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuSchema);