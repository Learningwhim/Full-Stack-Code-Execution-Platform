const express = require('express');
const router = express.Router();
const {  createUserController, loginUser} = require('../controllers/authController')
router.post('/login', loginUser);
router.post('/register', createUserController);

module.exports = router;