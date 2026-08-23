const likemodel= require('../models/like.model')
const user= require('../models/user.model')


const togglelike = async (req, res) => {
    try {
        const { postId } = req.body

        const loggedinuserid = req.user._id

        const existinglike = await likemodel.findOne({
            user: loggedinuserid,
            post: postId
        })

        if (existinglike) {
            await likemodel.findByIdAndDelete(existinglike._id)

            return res.status(200).json({
                message: "Unliked successfully",
                liked: false
            })
        }

        const newlike = new likemodel({
            user: loggedinuserid,
            post: postId
        })

        await newlike.save()

        return res.status(201).json({
            message: "Liked successfully",
            liked: true
        })

    } catch (err) {
        console.log(err)

        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}


const seelikes = async (req, res) => {
    try {
        const { postId } = req.query

        const likes = await likemodel
            .find({ post: postId })
            .populate('user', 'name username profilePic')

        return res.status(200).json({
            count: likes.length,
            likes
        })

    } catch (err) {
        console.log(err)

        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}

const countlikes = async (req, res) => {
    try {
        const { postId } = req.query

        const count = await likemodel.countDocuments({
            post: postId
        })

        return res.status(200).json({
            count
        })

    } catch (err) {
        console.log(err)

        return res.status(500).json({
            message: "Something went wrong"
        })
    }
}
module.exports= {togglelike,seelikes,countlikes}