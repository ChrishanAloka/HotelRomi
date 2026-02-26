const express = require('express');
const router = express.Router();
const { getInvoices, getInvoiceById, createRoomInvoice, createRestaurantBill, updateInvoice } = require('../controllers/invoiceController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, getInvoices);
router.get('/:id', protect, adminOnly, getInvoiceById);
router.post('/room', protect, adminOnly, createRoomInvoice);
router.post('/restaurant', protect, adminOnly, createRestaurantBill);
router.put('/:id', protect, adminOnly, updateInvoice);

module.exports = router;