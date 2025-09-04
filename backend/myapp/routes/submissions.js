
const express = require('express');
const { createSubmission,getSubmissionStatus} = require('../controllers/submissionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/submit',authMiddleware, createSubmission);
router.get('/status/:submission_id', getSubmissionStatus);

module.exports = router;