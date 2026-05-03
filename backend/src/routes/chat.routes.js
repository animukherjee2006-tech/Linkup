const express = require('express');
const router = express.Router();
const chatController = require('../controller/chatController');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/messages/:user1/:user2', authMiddleware, chatController.getMessages);

router.get('/all/:userId', authMiddleware, chatController.getUserChats);

module.exports = router;