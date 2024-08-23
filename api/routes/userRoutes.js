const express = require('express');
const { test, updateUser, deleteUser } = require('../controllers/userController');
const { verifyToken } = require('../utils/verifyToken');

const router = express.Router();

router.get('/', test);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);

module.exports = router;