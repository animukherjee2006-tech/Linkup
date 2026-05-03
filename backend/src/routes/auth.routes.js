const express= require('express')

const router= express.Router()
const authcontroller= require('../controller/auth.controller')

router.post('/register',authcontroller.register)
router.post('/loginuser',authcontroller.loginuser)
router.post('/logoutuser',authcontroller.logout)

module.exports= router
