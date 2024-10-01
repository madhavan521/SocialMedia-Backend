const express= require("express")
const authrouter = express.Router()
const {signup,login,logout,getMe} = require('../Controller/AuthController')
const protectRoute = require('../MiddleWare/ProtectRouter')

authrouter.get('/me',protectRoute , getMe)
authrouter.post('/signup', signup)
authrouter.post('/login', login)
authrouter.post('/logout', logout)



module.exports = authrouter

