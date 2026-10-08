const express = require('express');
const router = express.Router();
const commentController = require('../controller/commentController');
const authMiddleware = require('../middleware/auth.middleware'); // Your JWT Middleware

// Protected Routes
router.post('/addcomment', authMiddleware, commentController.addComment);
router.get('/seecomments', authMiddleware, commentController.getPostComments);
router.delete('/deletecomment/:commentId', authMiddleware, commentController.deleteComment);

module.exports = router;