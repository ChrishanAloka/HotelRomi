const express = require('express');
const router = express.Router();
const { getOrders, getOrdersByPhone, createOrder, updateOrderStatus } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, getOrders);
router.get('/phone/:phone', getOrdersByPhone);
router.post('/', createOrder);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;