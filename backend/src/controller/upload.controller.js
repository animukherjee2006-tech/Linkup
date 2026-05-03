const cloudinary = require('../config/cloudinary');
const posts = require('../models/post.model');
const User = require('../models/user.model'); // ADDED: Import User model for search functionality

const uploadfile = async (req, res) => {
    let result = null;

    try {
        const { caption } = req.body;
        const file = req.file;
        
        // 1. Get User ID from Middleware
        const userId = req.user?._id; 
        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        // 2. Conditional Cloudinary Upload
        // If there's a file, upload it. If not, skip this block.
        if (file) {
            try {
                result = await cloudinary.uploader.upload(file.path, {
                    resource_type: "auto",
                    folder: "linkup_posts"
                });
            } catch (uploadErr) {
                return res.status(502).json({ message: "Cloudinary upload failed" });
            }
        }

        // 3. Match Schema Fields
        // If result exists, use its data. Otherwise, default to text post.
        const postData = {
            username: userId,
            caption: caption,
            mediaurl: result ? result.secure_url : null, // Null if text-only
            mediatype: result ? (result.resource_type === "video" ? "video" : "image") : "text",
        };

        // Add public_id only if a file was actually uploaded
        if (result) {
            postData.public_id = result.public_id;
        }

        const newPost = new posts(postData);
        await newPost.save();

        res.status(201).json({ success: true, newPost });

    } catch (error) {
        console.error("Save Error:", error);
        // Cleanup Cloudinary if DB fails and a file was uploaded
        if (result) await cloudinary.uploader.destroy(result.public_id);
        res.status(500).json({ message: error.message });
    }
};

const searchPosts = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(200).json({ posts: [] });
        }

        // 1. Find users first (to search by username string)
        const matchedUsers = await User.find({ // Use 'User' here
            username: { $regex: query, $options: 'i' }
        }).select('_id');

        const userIds = matchedUsers.map(u => u._id);

        // 2. Search posts
        const foundPosts = await posts.find({ // MUST match your import 'posts'
            $or: [
                { caption: { $regex: query, $options: 'i' } },
                { username: { $in: userIds } } // Match the User IDs we just found
            ]
        }).populate("username", "_id username profilePic");

        res.status(200).json({ posts: foundPosts });
    } catch (err) {
        console.error("SEARCH ERROR:", err); // This prints the EXACT error in your terminal
        res.status(500).json({ message: err.message });
    }
};
const seeposts = async (req, res) => {
    try {
        // Populating username and email to show author details in the feed
        const postss = await posts.find().sort({ createdAt: -1 }).populate("username", "username email");
        res.status(200).json({ postss });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error occurred while fetching posts" });
    }
};

module.exports = { uploadfile, seeposts,searchPosts };