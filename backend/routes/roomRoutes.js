const express = require('express');
const router = express.Router();
const { getRooms, getRoomById, checkAvailability, createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getRooms);
router.get('/availability', checkAvailability);
router.get('/:id', getRoomById);
router.post('/', protect, adminOnly, createRoom);
router.put('/:id', protect, adminOnly, updateRoom);
router.delete('/:id', protect, adminOnly, deleteRoom);

module.exports = router;