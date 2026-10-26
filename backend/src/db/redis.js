
const redis = require('redis')

const redisClient= redis.createClient({
    url:process.env.REDIS_URL || 'redis://localhost:6375'
})

redisClient.on('error',(err)=>console.error("redis client error",err))
redisClient.on('connect',()=>console.log("redis connected sucessfully"))

const connectredis = async() => {
    if(!redisClient.isOpen){
        redisClient.connect();
    }
}

module.exports = connectredis
