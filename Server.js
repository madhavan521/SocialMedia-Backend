const express = require("express")
const app = express()
const cors=require("cors")
const cookieParser = require('cookie-parser');
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
 const PORT = process.env.PORT
const DatabaseConnection =require('./Database/DatabaseConnection')
const authrouter =require('./Route/AuthRouter')
const userrouter = require('./Route/UserRouter')
const postrouter = require('./Route/PostRouter');
const notificationrouter = require("./Route/NotificationRouter");



//MiddleWare
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin: 'https://social-media-frontend-bay.vercel.app', 
    credentials: true  
  }));
  app.use('/api/auth' , authrouter)
app.use('/api/user' ,userrouter)
app.use('/api/posts',postrouter)
app.use('/api/notification' ,notificationrouter)







// database connection
DatabaseConnection()
// Server Connection
app.listen(PORT , ()=>{
    console.log(`Server Started Listening at ${PORT}`)
})
