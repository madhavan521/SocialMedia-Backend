const jwt = require("jsonwebtoken")

const generateTokenSetCookies=(userId ,res)=>{

    const Token = jwt.sign({userId},process.env.JWT_SECRET ,{expiresIn:"15d"})

  res.cookie('jwt', Token, {  
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days  
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie  
    secure: true,
      sameSite: 'none' // Allows cross-site cookie requests 
});
      
}

module.exports=generateTokenSetCookies
