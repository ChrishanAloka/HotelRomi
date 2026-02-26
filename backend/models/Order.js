const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    items: [{
        menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
        name: String,
        price: Number,
        quantity: { type: Number, default: 1 }
    }],
    orderType: { type: String, enum: ['Takeaway', 'Room Service', 'Dine In'], default: 'Takeaway' },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    totalAmount: Number,
    notes: String
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);