const express = require('express');
const router = express.Router();
const { handleWorkerbroadcast } = require('../controllers/broadcastController');
router.post('/broadcastUpdate', handleWorkerbroadcast);
module.exports = router;