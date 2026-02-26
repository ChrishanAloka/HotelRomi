const Invoice = require('../models/Invoice');
const Booking = require('../models/Booking');
const Order = require('../models/Order');

exports.getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find().sort({ createdAt: -1 });
        res.json(invoices);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate('booking').populate('order');
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        res.json(invoice);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createRoomInvoice = async (req, res) => {
    try {
        const booking = await Booking.findById(req.body.bookingId).populate('rooms');
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        const nights = Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24));
        const items = booking.rooms.map(room => ({
            description: `${room.type} Room (${room.roomNumber}) - ${nights} night(s)`,
            quantity: nights,
            unitPrice: room.price,
            total: room.price * nights
        }));

        if (booking.includeRoomService) {
            const rsCharge = req.body.roomServiceCharge !== undefined ? req.body.roomServiceCharge : 500;
            items.push({ description: 'Room Service', quantity: 1, unitPrice: rsCharge, total: rsCharge });
        }

        const subtotal = items.reduce((s, i) => s + i.total, 0);
        const tax = req.body.tax !== undefined ? req.body.tax : Math.round(subtotal * 0.1);
        const discount = req.body.discount || 0;

        const invoice = await Invoice.create({
            type: 'Room',
            booking: booking._id,
            customerName: booking.customerName,
            customerPhone: booking.customerPhone,
            items,
            subtotal,
            tax,
            discount,
            totalAmount: subtotal + tax - discount,
            notes: req.body.notes
        });

        await Booking.findByIdAndUpdate(booking._id, { invoiceGenerated: true });
        res.status(201).json(invoice);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createRestaurantBill = async (req, res) => {
    try {
        const order = await Order.findById(req.body.orderId);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        const items = order.items.map(i => ({
            description: i.name,
            quantity: i.quantity,
            unitPrice: i.price,
            total: i.price * i.quantity
        }));
        const subtotal = items.reduce((s, i) => s + i.total, 0);
        const tax = req.body.tax !== undefined ? req.body.tax : Math.round(subtotal * 0.1);
        const discount = req.body.discount || 0;

        const invoice = await Invoice.create({
            type: 'Restaurant',
            order: order._id,
            customerName: order.customerName,
            customerPhone: order.customerPhone,
            items,
            subtotal,
            tax,
            discount,
            totalAmount: subtotal + tax - discount,
            notes: req.body.notes
        });

        res.status(201).json(invoice);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(invoice);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};