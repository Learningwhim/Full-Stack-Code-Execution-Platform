const express = require('express');
const createTestcase = require('../controllers/testcaseController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/addTestcase',authMiddleware, createTestcase);
module.exports = router;