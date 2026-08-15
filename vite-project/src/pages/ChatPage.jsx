import { useEffect, useState, useRef, useCallback } from "react";
import { socket } from "../socket/socket";
import getMessages from "../services/chatService";
import axios from "axios";
import {
  ArrowLeft,
  Send,
  MoreVertical,
  Search,
  MessageCircle,
  Phone,
  Video,
} from "lucide-react";

const ChatPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [followingList, setFollowingList] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [inputText, setInputText] = useState("");
  const [searchText, setSearchText] = useState("");

  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem("token");

      try {
        const [profileRes, followRes] = await Promise.all([
          axios.get(
            "https://linkup-144b.onrender.com/api/userpost/seeprofile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          ),
          axios.get(
            "https://linkup-144b.onrender.com/api/followroute/seefollow",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          ),
        ]);

        const user = profileRes.data.userprofile;

        setCurrentUser(user);
        setFollowingList(followRes.data.fullFollowingDetails || []);

        socket.emit("joinRoom", {
          userId: user._id,
        });
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!activeChat?._id || !currentUser?._id) return;

    const loadConversation = async () => {
      setMessages([]);

      try {
        const data = await getMessages(
          currentUser._id,
          activeChat._id
        );

        setMessages(data || []);

        setTimeout(scrollToBottom, 100);
      } catch (error) {
        console.error("Failed to load messages:", error);
      }
    };

    loadConversation();

    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  }, [activeChat?._id, currentUser?._id, scrollToBottom]);

  useEffect(() => {
    const handleNewMessage = (msg) => {
      if (!activeChat) return;

      const isRelevant =
        msg.senderId === activeChat._id ||
        msg.receiverId === activeChat._id;

      if (!isRelevant) return;

      setMessages((prev) => {
        const duplicate = prev.some(
          (message) =>
            message._id === msg._id ||
            (message.tempId && message.tempId === msg.tempId)
        );

        if (duplicate) return prev;

        return [...prev, msg];
      });

      setTimeout(scrollToBottom, 50);
    };

    socket.on("receive_message", handleNewMessage);

    return () => {
      socket.off("receive_message", handleNewMessage);
    };
  }, [activeChat, scrollToBottom]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!activeChat || !currentUser || !inputText.trim()) return;

    const msgData = {
      senderId: currentUser._id,
      receiverId: activeChat._id,
      message: inputText.trim(),
      tempId: Date.now(),
      createdAt: new Date(),
    };

    socket.emit("send_message", msgData);

    setMessages((prev) => [...prev, msgData]);
    setInputText("");

    setTimeout(scrollToBottom, 50);
  };

  const filteredUsers = followingList.filter((user) => {
    const search = searchText.toLowerCase();

    return (
      user.username?.toLowerCase().includes(search) ||
      user.fullname?.toLowerCase().includes(search)
    );
  });

  const getInitial = (user) =>
    user?.username?.charAt(0)?.toUpperCase() || "?";

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-11 h-11 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
          <p className="text-sm text-gray-500 font-medium">
            Loading your chats...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6fb] md:p-5">
      <div className="flex h-screen md:h-[calc(100vh-40px)] max-w-[1500px] mx-auto bg-white md:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden border border-gray-100">
        <aside
          className={`${
            showSidebar ? "flex" : "hidden"
          } md:flex w-full md:w-[340px] lg:w-[390px] flex-col bg-white border-r border-gray-100`}
        >
          <div className="px-5 pt-6 pb-5">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-[0.2em]">
                  Messages
                </p>
                <h1 className="text-2xl font-black text-gray-900 mt-1">
                  Chats
                </h1>
              </div>

              <button className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 flex items-center justify-center transition">
                <MoreVertical size={19} />
              </button>
            </div>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search conversations"
                className="w-full bg-[#f6f7fb] border border-transparent rounded-2xl py-3 pl-11 pr-4 text-sm outline-none transition focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const isActive = activeChat?._id === user._id;

                return (
                  <button
                    key={user._id}
                    onClick={() => setActiveChat(user)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl mb-1 text-left transition-all ${
                      isActive
                        ? "bg-indigo-50 shadow-sm"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                          isActive
                            ? "bg-indigo-600 text-white"
                            : "bg-indigo-100 text-indigo-700"
                        }`}
                      >
                        {getInitial(user)}
                      </div>

                      <span className="absolute -right-0.5 -bottom-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-[3px] border-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-gray-900 truncate">
                          {user.fullname || user.username}
                        </h3>

                        <span className="text-[10px] text-gray-400">
                          Active
                        </span>
                      </div>

                      <p className="text-sm text-gray-500 truncate mt-0.5">
                        @{user.username}
                      </p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <Search size={22} className="text-gray-400" />
                </div>

                <h3 className="font-bold text-gray-800">
                  No conversations found
                </h3>

                <p className="text-sm text-gray-400 mt-1">
                  Try searching for another person.
                </p>
              </div>
            )}
          </div>
        </aside>

        <main
          className={`${
            !showSidebar ? "flex" : "hidden"
          } md:flex flex-1 flex-col min-w-0 bg-[#f8f9fd]`}
        >
          {activeChat ? (
            <>
              <header className="h-[76px] px-4 md:px-7 bg-white border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setShowSidebar(true)}
                    className="md:hidden w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center"
                  >
                    <ArrowLeft size={21} />
                  </button>

                  <div className="relative">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                      {getInitial(activeChat)}
                    </div>

                    <span className="absolute -right-0.5 -bottom-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-[3px] border-white" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-bold text-gray-900 truncate">
                      {activeChat.fullname || activeChat.username}
                    </h2>

                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      <span className="text-xs text-gray-500">
                        Active now
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button className="hidden sm:flex w-10 h-10 rounded-xl hover:bg-gray-100 items-center justify-center text-gray-500 hover:text-indigo-600 transition">
                    <Phone size={19} />
                  </button>

                  <button className="hidden sm:flex w-10 h-10 rounded-xl hover:bg-gray-100 items-center justify-center text-gray-500 hover:text-indigo-600 transition">
                    <Video size={20} />
                  </button>

                  <button className="w-10 h-10 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-500 transition">
                    <MoreVertical size={19} />
                  </button>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
                <div className="max-w-4xl mx-auto space-y-3">
                  {messages.length === 0 ? (
                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 rounded-3xl bg-indigo-100 flex items-center justify-center mb-5">
                        <MessageCircle
                          size={34}
                          className="text-indigo-600"
                        />
                      </div>

                      <h3 className="text-xl font-bold text-gray-800">
                        Start a conversation
                      </h3>

                      <p className="text-sm text-gray-500 mt-2 max-w-xs">
                        Send a message to{" "}
                        <span className="font-semibold text-gray-700">
                          {activeChat.fullname || activeChat.username}
                        </span>
                        .
                      </p>
                    </div>
                  ) : (
                    messages.map((msg, index) => {
                      const isSender =
                        msg.senderId === currentUser._id;

                      return (
                        <div
                          key={msg._id || msg.tempId || index}
                          className={`flex ${
                            isSender
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`group max-w-[82%] sm:max-w-[70%] ${
                              isSender ? "items-end" : "items-start"
                            } flex flex-col`}
                          >
                            <div
                              className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                isSender
                                  ? "bg-indigo-600 text-white rounded-br-md"
                                  : "bg-white text-gray-800 border border-gray-100 rounded-bl-md"
                              }`}
                            >
                              <p className="break-words">
                                {msg.message}
                              </p>

                              <div
                                className={`text-[10px] mt-1.5 ${
                                  isSender
                                    ? "text-indigo-200 text-right"
                                    : "text-gray-400"
                                }`}
                              >
                                {formatTime(msg.createdAt)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="px-4 md:px-7 py-4 bg-white border-t border-gray-100">
                <form
                  onSubmit={handleSendMessage}
                  className="max-w-4xl mx-auto flex items-center gap-3"
                >
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Write a message..."
                      className="w-full bg-[#f5f6fa] border border-transparent rounded-2xl py-3.5 px-5 pr-12 text-sm outline-none focus:bg-white focus:border-indigo-200 focus:ring-4 focus:ring-indigo-50 transition placeholder:text-gray-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="w-12 h-12 flex-shrink-0 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0 transition-all"
                  >
                    <Send size={19} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center p-10">
              <div className="max-w-md text-center">
                <div className="w-24 h-24 mx-auto rounded-[28px] bg-white shadow-xl flex items-center justify-center mb-7">
                  <MessageCircle
                    size={40}
                    className="text-indigo-600"
                  />
                </div>

                <h2 className="text-3xl font-black text-gray-900">
                  Your messages
                </h2>

                <p className="text-gray-500 mt-3 leading-relaxed">
                  Select someone from your conversations and start
                  chatting. Your private conversations will appear here.
                </p>

                <div className="mt-7 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm text-xs font-semibold text-gray-500">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                  Your chats are ready
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ChatPage;