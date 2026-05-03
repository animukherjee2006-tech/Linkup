const likemodel= require('../models/like.model')
const user= require('../models/user.model')
const togglelike= async(req,res)=>{
    try{
        const {targetuserid}= req.body
         
        const loggedinuserid= req.user._id

        const existinglike= await likemodel.findOne({
            user:loggedinuserid
        })

        if(existinglike){
            await likemodel.findByIdAndDelete(existinglike._id)

             return res.status(200).json({
               message:"Unliked succesfully"
            })
        }else{
            const newlike= loggedinuserid

            await newlike.save()
        }

        return res.status(201).json({
            message:"liked succesfully"
        })
    }catch(err){
        console.log(err)

        return res.status(500).json({
            message:"Somthing went wrong"
        })
    }
}


const seelikes= async(req,res)=>{
    try{
        const likes= await likemodel.find({
            user
        })

        res.status(200).json({
            likes
        })
    }catch(err){
        console.log(err)

        return res.status(500).json({
            message:"Somthing went wrong"
        })
    }
}
module.exports= {togglelike,seelikes}