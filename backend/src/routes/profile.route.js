const express = require('express');
const router = express.Router();
const profilecontroller = require('../controller/profile.controller');
const authmiddleware = require('../middleware/auth.middleware');

router.get('/seeprofile', authmiddleware, profilecontroller.seeprofile)
router.get('/seeuserposts', authmiddleware, profilecontroller.seeuserposts)
router.get('/seeuserfollowers', authmiddleware, profilecontroller.seeuserfollowers)
router.get('/seeuserfollowing', authmiddleware, profilecontroller.seeuserfollowing)
router.get('/seeanyprofile/:userId', authmiddleware, profilecontroller.getAnyUserProfile)

module.exports = router;