const mongoose= require('mongoose')

const followchema= new mongoose.Schema({
    follower:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    following:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{
    timestamps:true
})

const followmodel= mongoose.model('Follow',followchema)

module.exports= followmodel