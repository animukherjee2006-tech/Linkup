const user= require('../models/user.model')
const posts= require('../models/post.model')
const Follow= require('../models/follow.model')
const seeprofile= async(req,res) =>{
    try{

        const userprofile= await user.findById(req.user._id).select('-password -__v')
        if(!userprofile){
            return res.status(404).json({message:"User not found"})
        }

        res.status(200).json({userprofile})
        }catch(err){
            res.status(500).json({message: err.message})
      
    }
}

const seeuserposts= async(req,res)=>{
    try{
        const userposts= await posts.find({username:req.user._id}).sort({createdAt:-1})
        res.status(200).json({userposts})
    }catch(err){
        res.status(500).json({message: err.message})
    }
}

const seeuserfollowers= async(req,res)=>{
    try{
        const followers = await Follow.find({following:req.user._id}).populate('follower','username fullname profilePicture')
        res.status(200).json({followers})
    }catch(err){
        res.status(500).json({message: err.message})
    }
}

const seeuserfollowing= async(req,res)=>{
    try{
        const following = await Follow.find({follower:req.user._id}).populate('following','username fullname profilePicture')
        res.status(200).json({following})
    }catch(err){
        res.status(500).json({message: err.message})
    }

}

const getAnyUserProfile = async (req, res) => {
    try {
        const { userId } = req.params; // Destructure userId
        
        // Model variable 'user' (small 'u') hi use karein jo aapne import kiya hai
        const userData = await user.findById(userId).select('-password');
        
        if (!userData) {
            return res.status(404).json({ message: "User not found in database" });
        }

        const userPosts = await posts.find({ username: userId }).sort({ createdAt: -1 });

        // Response waisa hi bhej rahe hain jaisa frontend expect kar raha hai
        res.status(200).json({ user: userData, userPosts });
    } catch (err) {
        console.error("Backend Error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
module.exports= {seeprofile,seeuserposts,seeuserfollowers,seeuserfollowing,getAnyUserProfile}