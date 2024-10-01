const express = require("express")
const protectRoute = require("../MiddleWare/ProtectRouter")
const postrouter = express.Router()
const {createpost,deletepost,commentpost,likepost, getAllpost, likedpost,feedpost, getUserpost} = require('../Controller/PostController')
postrouter.get('/getall',protectRoute , getAllpost)
postrouter.get('/likes/:id',protectRoute ,likedpost)
postrouter.get('/feed/:id' ,protectRoute , feedpost)
postrouter.post('/create' , protectRoute ,createpost ) 
postrouter.post('/comment/:id' , protectRoute ,commentpost )                 
postrouter.post('/like/:id' , protectRoute ,likepost )         
postrouter.delete('/delete/:id' , protectRoute ,deletepost )         
postrouter.get('/user/:username' , protectRoute ,getUserpost)


module.exports = postrouter