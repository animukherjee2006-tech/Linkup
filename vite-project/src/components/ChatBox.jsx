const ChatBox = ({ messages, currentUser }) => {
  return (
    <div className="space-y-3">
      {messages.map((msg, index) => {
        const isMe = msg.senderId === currentUser;
        return (
          <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
              isMe 
              ? "bg-indigo-600 text-white rounded-tr-none" 
              : "bg-gray-100 text-gray-800 rounded-tl-none"
            }`}>
              {msg.message}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatBox;