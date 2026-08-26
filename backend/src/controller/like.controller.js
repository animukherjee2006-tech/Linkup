const likemodel = require("../models/like.model");


// ==========================================
// LIKE / UNLIKE
// ==========================================

const togglelike = async (req, res) => {
    try {
        const { postId } = req.body;

        if (!postId) {
            return res.status(400).json({
                message: "Post ID is required"
            });
        }

        const loggedinuserid = req.user._id;

        const existinglike = await likemodel.findOne({
            user: loggedinuserid,
            post: postId
        });

        // =========================
        // UNLIKE
        // =========================

        if (existinglike) {
            await likemodel.findByIdAndDelete(existinglike._id);

            const count = await likemodel.countDocuments({
                post: postId
            });

            return res.status(200).json({
                message: "Unliked successfully",
                liked: false,
                count
            });
        }

        // =========================
        // LIKE
        // =========================

        const newlike = new likemodel({
            user: loggedinuserid,
            post: postId
        });

        await newlike.save();

        const count = await likemodel.countDocuments({
            post: postId
        });

        return res.status(201).json({
            message: "Liked successfully",
            liked: true,
            count
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


// ==========================================
// SEE WHO LIKED
// ==========================================

const seelikes = async (req, res) => {
    try {
        const { postId } = req.query;

        if (!postId) {
            return res.status(400).json({
                message: "Post ID is required"
            });
        }

        const likes = await likemodel
            .find({ post: postId })
            .populate(
                "user",
                "name fullname username profilePic"
            )
            .sort({ createdAt: -1 });

        return res.status(200).json({
            count: likes.length,
            likes
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


// ==========================================
// COUNT LIKES
// ==========================================

const countlikes = async (req, res) => {
    try {
        const { postId } = req.query;

        if (!postId) {
            return res.status(400).json({
                message: "Post ID is required"
            });
        }

        const count = await likemodel.countDocuments({
            post: postId
        });

        return res.status(200).json({
            count
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


// ==========================================
// CHECK CURRENT USER LIKE
// ==========================================
const checklike = async (req, res) => {
    try {
        const { postId } = req.query;

        if (!postId) {
            return res.status(400).json({
                message: "Post ID is required"
            });
        }

        const loggedinuserid = req.user._id;

        console.log("CHECK LIKE");
        console.log("User:", loggedinuserid);
        console.log("Post:", postId);

        const existinglike = await likemodel.findOne({
            user: loggedinuserid,
            post: postId
        });

        console.log(
            "Existing like:",
            existinglike
        );

        return res.status(200).json({
            liked: !!existinglike
        });

    } catch (err) {
        console.log("CHECK LIKE ERROR:", err);

        return res.status(500).json({
            message: "Something went wrong"
        });
    }
};


module.exports = {
    togglelike,
    seelikes,
    countlikes,
    checklike
};