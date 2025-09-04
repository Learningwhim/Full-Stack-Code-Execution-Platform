const express = require('express');
const router = express.Router();
const analyzeController = require('../controllers/analysisController');
router.post('/analyze',analyzeController);

module.exports = router;