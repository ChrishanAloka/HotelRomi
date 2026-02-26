const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: String,
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 },
    includeRoomService: { type: Boolean, default: false },
    package: String,
    specialRequests: String,
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled'],
        default: 'Pending'
    },
    totalAmount: Number,
    invoiceGenerated: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);