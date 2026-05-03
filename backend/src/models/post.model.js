const mongoose = require('mongoose');

const postschema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    caption: {
        type: String,
        maxlength: 500
        
    },
    mediaurl: {
        type: String,
        required: false 
    },
    mediatype: {
        type: String,
        enum: ["image", "video", "text"],
        default: "text"
    }
}, {
    timestamps: true
});

const postmodel = mongoose.model("Posts", postschema);

module.exports = postmodel;