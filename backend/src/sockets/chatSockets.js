const jwt = require('jsonwebtoken');
const Message = require('../models/chat.mode');

const chatSockets = (io) => {
  io.on('connection', (socket) => {
    const token = socket.handshake.auth?.token;
    let verifiedUserId = null;

    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECREAT);
        verifiedUserId = (decoded.id || decoded._id)?.toString();
      }
    } catch (err) {
      console.error('Socket auth failed:', err.message);
    }

    socket.on('joinRoom', ({ userId }) => {
      if (!verifiedUserId || userId !== verifiedUserId) {
        return console.error('❌ Unauthorized joinRoom attempt blocked');
      }
      socket.join(userId);
      console.log(`👤 User ${userId} joined their private room.`);
    });

    socket.on('send_message', async (data) => {
      try {
        const { senderId, receiverId, message } = data;

        if (!senderId || !receiverId || !message) {
          return console.error("❌ Invalid message data received");
        }
        if (!verifiedUserId || senderId !== verifiedUserId) {
          return console.error("❌ Unauthorized send_message blocked");
        }

        const newMessage = new Message({ senderId, receiverId, message });
        const savedMessage = await newMessage.save();

        io.to(receiverId).emit('receive_message', savedMessage);
        io.to(senderId).emit('receive_message', savedMessage);
      } catch (err) {
        console.error("🔥 Socket Send Message Error:", err.message);
      }
    });

    socket.on('disconnect', () => {
      console.log('🔌 User disconnected:', socket.id);
    });
  });
};

module.exports = chatSockets;