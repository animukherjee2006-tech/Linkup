const express = require('express')

const router = express.Router()
const authcontroller = require('../controller/auth.controller')

router.post('/register', authcontroller.register)
router.post('/verify-otp', authcontroller.verifyOTP)
router.post('/loginuser', authcontroller.loginuser)
router.post('/verify-login-otp', authcontroller.verifyLoginOTP)
router.post('/forgot-password', authcontroller.forgotPassword)
router.post('/reset-password', authcontroller.resetPassword)
router.post('/logoutuser', authcontroller.logout)

module.exports = router