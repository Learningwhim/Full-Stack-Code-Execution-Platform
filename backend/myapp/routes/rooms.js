const express = require('express');
const router = express.Router();
const {createRoomController,joinRoomController, getRoomController} = require('../controllers/roomController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, createRoomController);
router.post('/join', authMiddleware, joinRoomController);
router.get('/:room_code', authMiddleware, getRoomController);
module.exports = router; 