const jwt = require("jsonwebtoken")

const generateTokenSetCookies=(userId ,res)=>{

    const Token = jwt.sign({userId},process.env.JWT_SECRET ,{expiresIn:"15d"})

    res.cookie('jwt', Token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        //httpOnly: true,
        // secure: false,  Keep false if you're not using HTTPS
      });
      
}

module.exports=generateTokenSetCookies
