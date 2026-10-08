const Comment = require('../models/coments.model');

// Add a new comment
exports.addComment = async (req, res) => {
    try {
        const { postId, comment } = req.body;
        const userId = req.user._id || req.user.id; // From auth middleware

        if (!postId || !comment || !comment.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Post ID and comment text are required.'
            });
        }

        const newComment = await Comment.create({
            user: userId,
            post: postId,
            comment: comment.trim()
        });

        // Populate user details for immediate UI rendering
        const populatedComment = await Comment.findById(newComment._id).populate(
            'user',
            'username fullname profilePic'
        );

        // Fetch total comments count for updated count
        const commentsCount = await Comment.countDocuments({ post: postId });

        return res.status(201).json({
            success: true,
            message: 'Comment added successfully.',
            comment: populatedComment,
            commentsCount
        });
    } catch (error) {
        console.error('Add Comment Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while adding comment.',
            error: error.message
        });
    }
};

// Get all comments for a post
exports.getPostComments = async (req, res) => {
    try {
        const { postId } = req.query;

        if (!postId) {
            return res.status(400).json({
                success: false,
                message: 'Post ID is required.'
            });
        }

        const comments = await Comment.find({ post: postId })
            .populate('user', 'username fullname profilePic')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            comments,
            count: comments.length
        });
    } catch (error) {
        console.error('Get Comments Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching comments.',
            error: error.message
        });
    }
};

// Delete a comment (Author or Post Owner)
exports.deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id || req.user.id;

        const targetComment = await Comment.findById(commentId);

        if (!targetComment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found.'
            });
        }

        // Check if user is comment creator
        if (String(targetComment.user) !== String(userId)) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this comment.'
            });
        }

        await Comment.findByIdAndDelete(commentId);

        const remainingCount = await Comment.countDocuments({ post: targetComment.post });

        return res.status(200).json({
            success: true,
            message: 'Comment deleted successfully.',
            commentsCount: remainingCount
        });
    } catch (error) {
        console.error('Delete Comment Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while deleting comment.',
            error: error.message
        });
    }
};