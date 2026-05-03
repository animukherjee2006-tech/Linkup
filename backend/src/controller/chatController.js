const Message = require('../models/chat.mode');

// Get messages between two users
const getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.params;

  const messages = await Message.find({
  $or: [
    { senderId: user1, receiverId: user2 }, // Ye fields Schema se match honi chahiye
    { senderId: user2, receiverId: user1 },
  ],
}).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};


// Get all chats of a user 
const getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Message.find({
      $or: [
        { senderId: userId },
        { receiverId: userId },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      chats,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

module.exports = { getMessages, getUserChats };