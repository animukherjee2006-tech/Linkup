const express= require('express')
const upload= require('../middleware/multer.middleware')
const uploadfile= require('../controller/upload.controller')
const authmiddleware= require("../middleware/auth.middleware")
const router=express.Router()

router.post('/makepost',authmiddleware,upload.single("file"),uploadfile.uploadfile)
router.get("/seeposts",authmiddleware,uploadfile.seeposts)
router.get("/searchposts",authmiddleware,uploadfile.searchPosts)

module.exports= router