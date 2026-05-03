import { useEffect, useState, useRef, useCallback } from "react";
import { socket } from "../socket/socket";
import getMessages from "../services/chatService";
import axios from "axios";
import { ArrowLeft, Send, MoreVertical } from "lucide-react"; // Icons

const ChatPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [followingList, setFollowingList] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true); 
  const [inputText, setInputText] = useState("");

  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // 1. Initial Load
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [profileRes, followRes] = await Promise.all([
          axios.get('http://localhost:3000/api/userpost/seeprofile', { withCredentials: true }),
          axios.get('http://localhost:3000/api/followroute/seefollow', { withCredentials: true })
        ]);
        const user = profileRes.data.userprofile;
        setCurrentUser(user);
        setFollowingList(followRes.data.fullFollowingDetails || []);
        socket.emit("joinRoom", { userId: user._id });
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // 2. Load History
  useEffect(() => {
    if (activeChat?._id && currentUser?._id) {
      const loadConversation = async () => {
        setMessages([]); 
        const data = await getMessages(currentUser._id, activeChat._id);
        setMessages(data || []);
        setTimeout(scrollToBottom, 100);
      };
      loadConversation();
      if (window.innerWidth < 768) setShowSidebar(false);
    }
  }, [activeChat?._id, currentUser?._id, scrollToBottom]);

  // 3. Socket Listener
  useEffect(() => {
    const handleNewMessage = (msg) => {
      const isRelevant = activeChat && 
        (msg.senderId === activeChat._id || msg.receiverId === activeChat._id);
      
      if (isRelevant) {
        setMessages((prev) => {
          const isDuplicate = prev.some(m => m._id === msg._id || (m.tempId && m.tempId === msg.tempId));
          if (isDuplicate) return prev;
          return [...prev, msg];
        });
        setTimeout(scrollToBottom, 50);
      }
    };
    socket.on("receive_message", handleNewMessage);
    return () => socket.off("receive_message", handleNewMessage);
  }, [activeChat, scrollToBottom]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!activeChat || !currentUser || !inputText.trim()) return;

    const msgData = {
      senderId: currentUser._id,
      receiverId: activeChat._id,
      message: inputText,
      tempId: Date.now(),
      createdAt: new Date(),
    };

    socket.emit("send_message", msgData);
    setMessages((prev) => [...prev, msgData]);
    setInputText("");
    setTimeout(scrollToBottom, 50);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen md:h-[90vh] bg-white md:m-4 md:rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
      
      {/* --- SIDEBAR (Message List) --- */}
      <div className={`${showSidebar ? "flex" : "hidden"} md:flex w-full md:w-80 lg:w-[400px] flex-col bg-gray-50 border-r`}>
        <div className="p-6 bg-white border-b">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Chats</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {followingList.map((user) => (
            <div 
              key={user._id}
              onClick={() => setActiveChat(user)}
              className={`flex items-center gap-4 p-4 cursor-pointer transition-all border-b border-gray-100 ${
                activeChat?._id === user._id ? "bg-white shadow-sm scale-[1.02] z-10 border-l-4 border-indigo-600" : "hover:bg-gray-100"
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                  {user.username[0].toUpperCase()}
                </div>
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 truncate">{user.fullname || user.username}</h4>
                <p className="text-xs text-gray-500 truncate">@{user.username}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- CHAT SECTION --- */}
      <div className={`${!showSidebar ? "flex" : "hidden"} md:flex flex-1 flex-col bg-white`}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 md:px-6 border-b flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowSidebar(true)} className="md:hidden p-2 -ml-2">
                  <ArrowLeft size={24} />
                </button>
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                  {activeChat.username[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-none">{activeChat.fullname || activeChat.username}</h3>
                  <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Active Now</span>
                </div>
              </div>
              <MoreVertical size={20} className="text-gray-400 cursor-pointer" />
            </div>

            {/* Message Display Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-[#F8F9FD]">
              {messages.map((msg, index) => {
                const isSender = msg.senderId === currentUser._id;
                return (
                  <div key={index} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] md:max-w-[70%] px-4 py-2.5 rounded-2xl shadow-sm text-sm md:text-base ${
                      isSender 
                        ? "bg-indigo-600 text-white rounded-tr-none" 
                        : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                    }`}>
                      {msg.message}
                      <span className={`block text-[10px] mt-1 opacity-60 ${isSender ? "text-right" : "text-left"}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-white flex items-center gap-3">
              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-100 border-none rounded-full px-5 py-3 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
              />
              <button 
                type="submit"
                disabled={!inputText.trim()}
                className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200"
              >
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center p-10 bg-gray-50">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-4xl mb-6">💬</div>
            <h2 className="text-2xl font-bold text-gray-800">Your Private Space</h2>
            <p className="text-gray-500 max-w-xs mt-2">Select a friend from the sidebar to start a secure conversation.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;