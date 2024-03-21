const express = require('express');
const { deleteChatUser, getChat, postConverstation, getConverstation } = require('../controllers/message.js');
const verifyToken = require('../middleware/auth.js');

const router = express.Router();

// Post Converstation
router.post('/', verifyToken, postConverstation);

// Read
router.get('/:userId', verifyToken, getConverstation);
router.get('/chat/:converstationId', verifyToken, getChat);

// Delete Many Chat
router.delete('/delete/:converstationId', verifyToken, deleteChatUser);

module.exports = router;
