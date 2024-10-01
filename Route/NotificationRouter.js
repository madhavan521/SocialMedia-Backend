const express = require("express")
const protectRoute = require("../MiddleWare/ProtectRouter")
const {getNotification ,deleteNotification}= require("../Controller/NotificationController")
const notificationrouter = express()

notificationrouter.get('/', protectRoute ,getNotification)
notificationrouter.delete('/', protectRoute ,deleteNotification)



module.exports = notificationrouter