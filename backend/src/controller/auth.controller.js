const user= require('../models/user.model')
const bcrypt= require('bcrypt')
const jwt= require('jsonwebtoken')
const cookie= require('cookie')
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

        const hashpassword=await bcrypt.hash(password,10)
        const newuser= new user({
            username,
            firstname,
            lastname,
            phone,
            email,
            password:hashpassword
        })

        await newuser.save()

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
       secure: process.env.NODE_ENV === 'production',
       sameSite: 'none'
   })
   res.status(200).json({message:"You are logout succesfully"})
}
module.exports= {register,loginuser,logout}