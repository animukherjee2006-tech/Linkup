import axios from "axios";

const getMessages = async (user1, user2) => {
  if (!user1 || !user2 || user1 === "undefined" || user2 === "undefined") return [];
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(
      `https://linkup-144b.onrender.com/api/chat/messages/${user1}/${user2}`,
      { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
    );
    return res.data.messages;
  } catch (err) {
    console.error("Chat API Error:", err);
    return [];
  }
};

export default getMessages;