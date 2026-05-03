const followmodel= require('../models/follow.model')
const usermodel= require("../models/user.model")
const toggleFollow = async (req, res) => {
  try {
    // FIX: Changed from 'targetuserid' to 'userId' to match Home.jsx
    const { userId } = req.body; 
    
    const loggedinuserid = req.user._id;

    
    if (!userId) {
      return res.status(400).json({ 
        message: "User ID is missing in request body" 
      });
    }

    if (loggedinuserid.toString() === userId) {
      return res.status(400).json({
        message: "You can't follow yourself"
      });
    }

    // Check if the follow relationship already exists
    const existingfollow = await followmodel.findOne({
      follower: loggedinuserid,
      following: userId
    });

    if (existingfollow) {
      // If found,Unfollow
      await followmodel.findByIdAndDelete(existingfollow._id);
      return res.status(200).json({
        message: "Unfollowed successfully"
      });
    } else {
      // If not found,Follow
      const newFollow = new followmodel({
        follower: loggedinuserid,
        following: userId 
      });
      await newFollow.save();

      return res.status(201).json({
        message: "Followed successfully"
      });
    }

  } catch (err) {
    console.error("Follow Error Log:", err);
    return res.status(500).json({
      message: "Something went wrong on the server"
    });
  }
};


const seefollow = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Get people I follow (FOLLOWING) 
        // We use .populate to get their username and fullname for the Chat List
        const followingData = await followmodel.find({ follower: userId })
            .populate('following', 'username fullname profilePic'); 

        // 2. Get people who follow me (FOLLOWERS)
        const followersData = await followmodel.find({ following: userId })
            .populate('follower', 'username fullname profilePic');

        res.status(200).json({
            // Simple array of IDs for the "+ Follow" vs "Following" button logic
            followingIds: followingData.map(item => item.following._id), 
            
            // Full details for the Chat Sidebar list
            fullFollowingDetails: followingData.map(item => item.following),
            fullFollowersDetails: followersData.map(item => item.follower),

            // Counts for the Profile page
            followersCount: followersData.length,
            followingCount: followingData.length
        });
    } catch (err) {
        console.error("Seefollow Error:", err);
        res.status(500).json({ message: "Error fetching follow data" });
    }
};
module.exports= {toggleFollow,seefollow}