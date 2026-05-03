import axios from "axios";

const getMessages = async (user1, user2) => {
  // Safety Check: Agar ID missing hai toh request mat bhejo
  if (!user1 || !user2 || user1 === "undefined" || user2 === "undefined") return [];
  
  try {
    const res = await axios.get(`https://linkup-144b.onrender.com/api/chat/messages/${user1}/${user2}`, { withCredentials: true });
    return res.data.messages;
  } catch (err) {
    console.error("Chat API Error:", err);
    return [];
  }
};

export default getMessages;