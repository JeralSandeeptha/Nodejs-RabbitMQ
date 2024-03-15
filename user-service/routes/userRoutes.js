const express = require('express');
const { getAllUsers, getUser, updateUser, deleteUser, registerUser } = require('../controllers/userControllers');

const router = express.Router();

router.post('/', registerUser);
router.get('/', getAllUsers);
router.get('/:userId', getUser);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);

module.exports = router;