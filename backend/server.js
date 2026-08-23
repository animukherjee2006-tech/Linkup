require('dotenv').config()

const express= require('express')
const http = require('http')
const app= require('./src/app')
const connectdb= require('./src/db/db')
const {Server}= require('socket.io')
const chatsockets= require('./src/sockets/chatSockets')


connectdb()


const server= http.createServer(app)
const allowedOrigins = [
  'http://localhost:5173',
  'https://linkup-1-frontend.onrender.com'
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST']
  }
});

chatsockets(io)

const PORT= process.env.PORT || 3000
server.listen(PORT,()=>{
    console.log('Server is running on ',PORT);
    
})