const express = require('express');
const { getAllProblems, createProblem , getProblemByIdController} = require('../controllers/problemController');
const router = express.Router();
router.post('/add-problem', createProblem);
router.get('/', getAllProblems);
router.get(`/:problem_id`, getProblemByIdController);

module.exports = router;