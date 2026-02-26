const Booking = require('../models/Booking');
const Room = require('../models/Room');

exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('room').sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBookingByPhone = async (req, res) => {
    try {
        const bookings = await Booking.find({ customerPhone: req.params.phone }).populate('room').sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createBooking = async (req, res) => {
    try {
        const { room, checkIn, checkOut } = req.body;
        // Check availability
        const conflict = await Booking.findOne({
            room,
            status: { $nin: ['Cancelled', 'Checked-Out'] },
            $or: [
                { checkIn: { $lt: new Date(checkOut), $gte: new Date(checkIn) } },
                { checkOut: { $gt: new Date(checkIn), $lte: new Date(checkOut) } },
                { checkIn: { $lte: new Date(checkIn) }, checkOut: { $gte: new Date(checkOut) } }
            ]
        });
        if (conflict) return res.status(400).json({ message: 'Room not available for selected dates' });

        const roomDoc = await Room.findById(room);
        if (!roomDoc) return res.status(404).json({ message: 'Room not found' });

        const adults = Number(req.body.adults || 0);
        const children = Number(req.body.children || 0);
        if (adults + children > roomDoc.capacity) {
            return res.status(400).json({
                message: `Total persons (${adults + children}) exceeds room capacity (${roomDoc.capacity})`
            });
        }

        const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
        const totalAmount = roomDoc.price * nights;

        const booking = await Booking.create({ ...req.body, totalAmount });
        res.status(201).json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        ).populate('room');
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('room');
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};