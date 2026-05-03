import { useState } from "react";

const MessageInput = ({ sendMessage }) => {
  const [text, setText] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(text);
    setText("");
  };

  return (
    <form onSubmit={handleSend} className="flex gap-2">
      <input
        className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Message..."
      />
      <button 
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-indigo-700 transition-colors"
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;