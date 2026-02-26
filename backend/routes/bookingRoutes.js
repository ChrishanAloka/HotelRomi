const express = require('express');
const router = express.Router();
const { getBookings, getBookingByPhone, createBooking, updateBookingStatus, updateBooking } = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, getBookings);
router.get('/phone/:phone', getBookingByPhone);
router.post('/', createBooking);
router.put('/:id/status', protect, adminOnly, updateBookingStatus);
router.put('/:id', protect, adminOnly, updateBooking);

module.exports = router;