const express= require('express')
const router= express.Router()

const authmiddleware= require('../middleware/auth.middleware')
const followcontroller= require('../controller/follow.controller')


router.post("/follow",authmiddleware,followcontroller.toggleFollow)
router.get("/seefollow",authmiddleware,followcontroller.seefollow)
module.exports=router
