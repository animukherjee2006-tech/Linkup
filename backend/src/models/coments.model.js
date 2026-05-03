const mongoose= require('mongoose')

const commentschema= new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Posts',
        required:true
    },
    comment:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

const commentmodel= mongoose.model('Comment',commentschema)

module.exports= commentschema