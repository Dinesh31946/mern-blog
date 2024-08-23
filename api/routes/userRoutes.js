const express = require('express');
const { test, updateUser, deleteUser, signout } = require('../controllers/userController');
const { verifyToken } = require('../utils/verifyToken');

const router = express.Router();

router.get('/', test);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);

module.exports = router;