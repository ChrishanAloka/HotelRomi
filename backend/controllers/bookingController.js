const Booking = require('../models/Booking');
const Room = require('../models/Room');

exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('rooms').sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBookingByPhone = async (req, res) => {
    try {
        const bookings = await Booking.find({ customerPhone: req.params.phone }).populate('rooms').sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createBooking = async (req, res) => {
    try {
        const { rooms, checkIn, checkOut } = req.body;
        // Check availability
        const conflict = await Booking.findOne({
            rooms: { $in: rooms },
            status: { $nin: ['Cancelled', 'Checked-Out'] },
            $or: [
                { checkIn: { $lt: new Date(checkOut), $gte: new Date(checkIn) } },
                { checkOut: { $gt: new Date(checkIn), $lte: new Date(checkOut) } },
                { checkIn: { $lte: new Date(checkIn) }, checkOut: { $gte: new Date(checkOut) } }
            ]
        });
        if (conflict) return res.status(400).json({ message: 'One or more rooms are not available for selected dates' });

        const roomDocs = await Room.find({ _id: { $in: rooms } });
        if (roomDocs.length !== rooms.length) return res.status(404).json({ message: 'One or more rooms not found' });

        const totalCapacity = roomDocs.reduce((sum, r) => sum + r.capacity, 0);
        const adults = Number(req.body.adults || 0);
        const children = Number(req.body.children || 0);
        if (adults + children > totalCapacity) {
            return res.status(400).json({
                message: `Total persons (${adults + children}) exceeds total capacity (${totalCapacity}) of selected rooms`
            });
        }

        const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
        const totalPricePerNight = roomDocs.reduce((sum, r) => sum + r.price, 0);
        const totalAmount = totalPricePerNight * nights;

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
        ).populate('rooms');
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('rooms');
        res.json(booking);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};