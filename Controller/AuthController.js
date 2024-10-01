const User = require('../Schema/UserSchema')
const bcrypt = require('bcryptjs')
const generateTokenSetCookies= require('../lib/GenerateToken')

//SIGNUP
const signup =async(req,res)=>{
   const {username , fullname , email , password}=req.body
   try{

    const EmailValidationData =/^\S+@\S+\.\S+$/;
    const Emailverification = EmailValidationData.test(email)
    if(!Emailverification)
    {
        return res.status(400).send("Invalid Email")
    }
    const UsernameVerification = await User.findOne({username})
    if(UsernameVerification){
        return res.status(400).send("Username Already Exist")
    }
    const EmailVerification = await User.findOne({email})
    if(EmailVerification){
        return res.status(400).send("Email Already Exist")
    }
    if(password.length <6) {
        return res.status(400).send("Minimum 6 characters required")
    }

    //hashing password

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password , salt)

      const newUser = new User({
        username,
        fullname ,
         email,
         password:hashedPassword
      })

      if(newUser){
        await newUser.save()
      generateTokenSetCookies(newUser._id ,res)

      res.status(201).json({
        _id: newUser._id,
        fullname:newUser.fullname,
        username:newUser.username,
        email:newUser.email,
        followers :newUser.followers,
        following  :newUser.following ,
        profileImg :newUser.profileImg,
        coverImg :newUser.coverImg

      })
      }
      else{
        res.status(400).send('Invalid User Data')
      }
    
   }
   catch(err){
    res.status(500).send("Internal Server Error")
   }
}

//LOGIN
const login=async(req,res)=>{
    try{   
         const{username,password} = req.body
        const userdata = await User.findOne({username})
        if(!userdata){
            return res.status(400).send("Invalid Username")
        }
        const isPasswordValid = await bcrypt.compare(password , userdata.password)
        if(!isPasswordValid){
            return res.status(400).send("Invalid  Password")
        }

        generateTokenSetCookies(userdata._id,res)
        res.status(200).json(     
            {    
                _id: userdata._id,      
                fullname:userdata.fullname,
                username:userdata.username,
                email: userdata.email,
                followers :userdata.followers,
                following  :userdata.following ,
                profileImg :userdata.profileImg,
                coverImg :userdata.coverImg
            }
        )
       }
    catch(err){
        res.status(500).send("Internal Server Error")
    }
}

//LOGOUT
const logout = async(req, res) => {
    try {
        res.cookie('jwt', '', {
            maxAge: 0,
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'Strict'
        });
        res.status(200).send("Logout Successfully");
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
};

const getMe = async (req, res) => {  
    try {  
        const user = await User.findById(req.user._id);  
        
        if (!user) {  
            return res.status(404).json({ message: "User not found" });  
        }  
        
        return res.status(200).json(user);  
    } catch (err) {  
        console.error(err); 
        return res.status(500).json({ message: "Internal Server Error" });  
    }  
};

module.exports={signup,login,logout,getMe}