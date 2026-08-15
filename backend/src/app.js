const express= require('express');
const authroutes= require('../src/routes/auth.routes')
const postroutes=require("../src/routes/upload.routes")
const followroutes= require("../src/routes/follow.route")
const likeroutes= require('../src/routes/like.route')
const userpost=require('../src/routes/profile.route')
const chatroutes= require('../src/routes/chat.routes')
const cookieparser= require('cookie-parser')
const cors= require('cors')
const app= express();


app.use(express.json())
app.use(cookieparser())
app.set('trust proxy', 1);

app.use(cors({
    origin: 'https://linkup-1-frontend.onrender.com', // Frontend URL
    credentials: true,               
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.urlencoded({ extended: true }))

app.use('/api/auth',authroutes)
app.use('/api/posts',postroutes)
app.use('/api/followroute',followroutes)
app.use('/api/likeroute',likeroutes)
app.use('/api/userpost',userpost)
app.use('/api/chat',chatroutes)



module.exports= app