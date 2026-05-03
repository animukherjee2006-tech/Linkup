const mongoose=require('mongoose')

const likeschema= new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },

    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Posts',
        required:true
    }
},{
    timestamps:true
})

const likemodel= mongoose.model('Like',likeschema)

module.exports= likemodel