const express= require('express')

const router= express.Router()

const like= require('../controller/like.controller')
const middleware= require('../middleware/auth.middleware')
router.post("/getlike",middleware,like.togglelike)
router.get('/seelike',middleware,like.seelikes)


module.exports= router