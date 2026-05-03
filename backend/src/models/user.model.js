const mongoose= require('mongoose')

const userschema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    firstname: {
        type:String,
        required:true
    },

    lastname:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        unique:true,
        required:true
    },

    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},
{timestamps:true}
)

const usermodel= mongoose.model("User",userschema)

module.exports= usermodel