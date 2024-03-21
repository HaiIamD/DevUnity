const express = require('express');
const { deletePost, getFeedPosts, getUserPosts, likePost, commentPost } = require('../controllers/posts.js');
const verifyToken = require('../middleware/auth.js');

const router = express.Router();

// Read
router.get('/', verifyToken, getFeedPosts);
router.get('/:userId/posts', verifyToken, getUserPosts);
// Delete
router.delete('/:id', verifyToken, deletePost);
// Update
router.patch('/:id/like', verifyToken, likePost);
// Update Comment
router.patch('/comments', verifyToken, commentPost);

module.exports = router;
