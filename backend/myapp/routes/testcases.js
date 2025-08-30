const express = require('express');
const createTestcase = require('../controllers/testcaseController')
const router = express.Router();

router.post('/addTestcase', createTestcase);
module.exports = router;