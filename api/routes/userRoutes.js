const express = require('express');
const { test, updateUser } = require('../controllers/userController');
const { verifyToken } = require('../utils/verifyToken');

const router = express.Router();

router.get('/', test);
router.put('/update/:userId', verifyToken, updateUser);

module.exports = router;