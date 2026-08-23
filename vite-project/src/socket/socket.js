import { io } from "socket.io-client";

export const socket = io("https://linkup-144b.onrender.com", {
  withCredentials: true,
  auth: { token: localStorage.getItem("token") },
});