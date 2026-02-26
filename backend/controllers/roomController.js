const Room = require('../models/Room');
const Booking = require('../models/Booking');

exports.getRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) return res.status(404).json({ message: 'Room not found' });
        res.json(room);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.checkAvailability = async (req, res) => {
    const { checkIn, checkOut, type } = req.query;
    try {
        const query = {};
        if (type) query.type = type;

        const rooms = await Room.find(query);
        const bookedRoomIds = await Booking.find({
            status: { $nin: ['Cancelled', 'Checked-Out'] },
            $or: [
                { checkIn: { $lt: new Date(checkOut), $gte: new Date(checkIn) } },
                { checkOut: { $gt: new Date(checkIn), $lte: new Date(checkOut) } },
                { checkIn: { $lte: new Date(checkIn) }, checkOut: { $gte: new Date(checkOut) } }
            ]
        }).distinct('rooms');

        const available = rooms.map(r => ({
            ...r._doc,
            isAvailable: !bookedRoomIds.map(id => id.toString()).includes(r._id.toString())
        }));

        res.json(available);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createRoom = async (req, res) => {
    try {
        const room = await Room.create(req.body);
        res.status(201).json(room);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(room);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteRoom = async (req, res) => {
    try {
        await Room.findByIdAndDelete(req.params.id);
        res.json({ message: 'Room deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};