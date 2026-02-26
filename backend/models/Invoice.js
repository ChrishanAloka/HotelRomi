const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: { type: String, unique: true },
    type: { type: String, enum: ['Room', 'Restaurant'], required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    customerName: String,
    customerPhone: String,
    items: [{
        description: String,
        quantity: Number,
        unitPrice: Number,
        total: Number
    }],
    subtotal: Number,
    tax: Number,
    discount: Number,
    totalAmount: Number,
    isPaid: { type: Boolean, default: false },
    notes: String
}, { timestamps: true });

invoiceSchema.pre('save', async function (next) {
    if (!this.invoiceNumber) {
        const count = await mongoose.model('Invoice').countDocuments();
        this.invoiceNumber = `ROMI-${String(count + 1).padStart(5, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);