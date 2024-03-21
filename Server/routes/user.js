const express = require('express');
const verifyToken = require('../middleware/auth');
const { Alluser, getUser, getUserFriends, addRemoveFriend } = require('../controllers/users');

const router = express.Router();

// Read Route
router.get('/:id', verifyToken, getUser);
router.get('/', verifyToken, Alluser);
router.get('/:id/friends', verifyToken, getUserFriends);

// Update Route
router.patch('/:id/:friendId', verifyToken, addRemoveFriend);

module.exports = router;
