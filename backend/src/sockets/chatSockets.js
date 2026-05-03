const Message = require('../models/chat.mode');

const chatSockets = (io) => {
  io.on('connection', (socket) => {


    socket.on('joinRoom', ({ userId }) => {
      if (userId) {
        socket.join(userId);
        console.log(`👤 User ${userId} joined their private room.`);
      }
    });

  
    socket.on('send_message', async (data) => {
      try {
        const { senderId, receiverId, message } = data;

        if (!senderId || !receiverId || !message) {
          return console.error("❌ Invalid message data received");
        }

        // Database save 
      
const newMessage = new Message({
  senderId,   // Schema ke field name se match hona chahiye
  receiverId, 
  message,
});


    const savedMessage = await newMessage.save();

    //inform both sender resiver
    io.to(receiverId).emit('receive_message', savedMessage);
    io.to(senderId).emit('receive_message', savedMessage);


      } catch (err) {
        console.error("🔥 Socket Send Message Error:", err.message);
      }
    });

    // DISCONNECT
    socket.on('disconnect', () => {
      console.log('🔌 User disconnected:', socket.id);
    });
  });
};

module.exports = chatSockets;