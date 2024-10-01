const express = require("express")
const userrouter = express.Router()
const {getUserProfile,followUnfollowUser,suggestUser,updateUser} = require('../Controller/UserController')
const protectRouter = require('../MiddleWare/ProtectRouter')

userrouter.get('/profile/:username',protectRouter ,getUserProfile)
userrouter.post('/follow/:id' ,protectRouter, followUnfollowUser)
userrouter.get('/suggest' , protectRouter ,suggestUser)
userrouter.post('/update', protectRouter,updateUser)


module.exports = userrouter