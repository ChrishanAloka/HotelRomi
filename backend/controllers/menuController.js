const MenuItem = require('../models/MenuItem');

exports.getMenuItems = async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) filter.category = req.query.category;
        if (req.query.available === 'true') filter.isAvailable = true;
        const items = await MenuItem.find(filter);
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.create(req.body);
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteMenuItem = async (req, res) => {
    try {
        await MenuItem.findByIdAndDelete(req.params.id);
        res.json({ message: 'Menu item deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};