const Order = require('../models/Order');

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('items.menuItem').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getOrdersByPhone = async (req, res) => {
    try {
        const orders = await Order.find({ customerPhone: req.params.phone }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const totalAmount = req.body.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const order = await Order.create({ ...req.body, totalAmount });
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};