const user= require('../models/user.model')
const bcrypt= require('bcrypt')
const jwt= require('jsonwebtoken')
const cookie= require('cookie')
const redisClient = require('../db/redis')
const sendOTPEmail = require('../config/emailservice')
const register= async(req,res)=> {
    try{
        const {username,firstname,lastname,phone,email,password}=req.body

        if(!username|| !firstname || !lastname || !phone || !email || !password){
            return res.status(400).json({message:"All fields are required"})
        }

        const userexists= await user.findOne({ 
            $or:[{username:req.body.username}
                ,{email:req.body.email},
                {phone:req.body.phone}
            ]}) 

        if(userexists){
            return res.status(400).json({message:"User is already exists"})
        }


        const otp = Math.floor(100000+ Math.random()*900000).toString()
        const hashpassword=await bcrypt.hash(password,10)
        const newuser= new user({
            username,
            firstname,
            lastname,
            phone,
            email,
            password:hashpassword
        })

         // Cache data for 5 mins (300 seconds)
        await redisClient.setEx(`otp:${email}`, 300, otp);
        await redisClient.setEx(`user-data:${email}`, 300, JSON.stringify(newuser));
  
        // Use email service
        await sendOTPEmail(email, username, otp);

        res.status(200).json({ message: "OTP sent to your email. Please verify within 5 minutes." });

    }catch(err){
        console.log(err)
          return res.status(500).json({message:'Somthing went wrong'})
    }
    
}

const loginuser= async(req,res)=>{
    try{
        const {username,firstname,lastname,email,phone,password}=req.body

        if(!username||!password){
            return res.status(400).json({
                message:"all fields are required"
            })
        }

        const userexists= await user.findOne({
            $or:[{username:req.body.username},
                {email:req.body.email},
                {phone:req.body.phone}
            ]
        })

        if(!userexists){
            return res.status(400).json({
                message:"This user is not exists"
            })
        }

        const ismatchpassword= await bcrypt.compare(password,userexists.password)

        if(!ismatchpassword){
            return res.status(501).json({
                message:"incorrect password"
            })
        }

        const token= jwt.sign({
            id:userexists._id
        },process.env.JWT_SECREAT, { 
            expiresIn:'7d'
        })

      res.cookie('token', token, {
    httpOnly: true,
    secure: true,        // IMPORTANT for Render HTTPS
    sameSite: 'none',     // VERY IMPORTANT for frontend-backend different domain
    maxAge: 7 * 24 * 60 * 60 * 1000
});

        
        res.status(200).json({message:"You are login succesfully", token: token})

    }catch(err){
        console.log(err);
        
        return res.status(500).json({
            message:"Somthing went wrong"
        })
    }
}

const logout= async(req,res)=>{
   res.clearCookie('token', {
       httpOnly: true,
       secure: true,
       sameSite: 'none'
   })
}


const verifyOTP=  async (req, res) => {
    try {
        const { Email, otp } = req.body;

        const cachedOtp = await redisClient.get(`otp:${Email}`);
        const cachedUserData = await redisClient.get(`user-data:${Email}`);

        if (!cachedOtp || !cachedUserData) {
            return res.status(400).json({ message: "OTP expired or invalid. Register again." });
        }

        if (cachedOtp !== otp) {
            return res.status(400).json({ message: "Incorrect OTP." });
        }

        const parsedData = JSON.parse(cachedUserData);
        
        let User = await user.findOne({ Email });
        if (!User) {
            User = new user({
                Username: parsedData.username,
                Email: parsedData.email,
                password: parsedData.password,
                firstname:parsedData.firstname,
                lastname:parsedData.lastname,
                phone:parsedData.phone
            });
        }
        
        User.isverified = true;
        await user.save();

        // Flush Redis Cache
        await redisClient.del(`otp:${Email}`);
        await redisClient.del(`user-data:${Email}`);

              const token= jwt.sign({
            id:newuser._id
        },process.env.JWT_SECREAT, { 
            expiresIn:'7d'
        })

 res.cookie('token', token, {
    httpOnly: true,
    secure: true,        // IMPORTANT for Render HTTPS
    sameSite: 'none',     // VERY IMPORTANT for frontend-backend different domain
    maxAge: 7 * 24 * 60 * 60 * 1000
});

    res.status(200).json({message:"You are register succesfully", token: token})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
module.exports= {register,loginuser,logout,verifyOTP}