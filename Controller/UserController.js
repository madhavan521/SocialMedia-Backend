const notification = require("../Schema/NotificatonSchema");
const User = require("../Schema/UserSchema");
const cloudinary = require("cloudinary").v2;
const bcrypt = require('bcryptjs')


const getUserProfile = async(req,res)=>{
    const {username}=req.params;
    try{
      const user = await User.findOne({username})
      if(!user){
       return res.status(400).send("User not found")
      }
      res.status(200).send(user)
    
    }
    catch(err){
        res.status(500).send(err)
    }

}
const followUnfollowUser = async (req, res) => {  
    console.log('Current user:', req.user);  
    const { id } = req.params;  
    try{
        const followUser = await User.findById(id)
        const currentUser = await User.findById(req.user._id)
        if(!followUser || !currentUser)
        {
            return res.status(400).send("User not found in this id")
        }
       if(id === req.user._id.toString()){
           return res.status(400).send("Cannot able to follow yourself")
       }

const follow = currentUser.following.includes(id)

if(follow){
    await User.findByIdAndUpdate(id,{$pull:{followers:req.user._id}})
    await User.findByIdAndUpdate(req.user._id , {$pull:{following:id}})


    return res.status(200).send("Unfollowed")

}
else{
    await User.findByIdAndUpdate(id,{$push:{followers:req.user._id}})
    await User.findByIdAndUpdate(req.user._id , {$push:{following:id}})
    const newNotification = new notification({
        type:"follow",
        from:req.user._id,
        to:followUser._id,
    
    })
    await newNotification.save()
  return  res.status(200).send("followed successfully")

}


        res.status(200).send(followUser)
    }
    catch(err){
        res.status(500).send({message :err.message})
    }
}
const suggestUser=async(req,res)=>{
try{  
     const userId = req.user._id

    const userFollowedByMe = await User.findById(userId).select("following")

    const users = await User.aggregate([
        {$match:{
            _id:{$ne:userId}
        }},
        {$sample:{size:10}}
    ])

    const filterUser = Array.isArray(users) && users.filter(user => !userFollowedByMe.following.includes(user._id))
    const suggestedUser=filterUser.slice(0,6)

res.status(200).send(suggestedUser)

}

catch(err){
    console.log({message:err.message})
}

}
const updateUser = async (req, res) => {  
    try {  
        let {bio, link } = req.body;  
        let { profileImg, coverImg } = req.body;  

        const userId = req.user._id;  

        let user = await User.findById(userId);  
        if (!user) {  
            return res.status(404).send("User not found");  
        }  

        // // Validate password inputs  
        // if ((!newpassword && currentpassword) || (newpassword && !currentpassword)) {  
        //     return res.status(400).send("Provide both currentpassword and newpassword");  
        // }  

        // // Handle password update  
        // if (newpassword && currentpassword) {  
        //     const isMatch = await bcrypt.compare(currentpassword, user.password);  
        //     if (!isMatch) {  
        //         return res.status(400).send("Current password is incorrect");  
        //     }  
        //     if (newpassword.length < 6) {  
        //         return res.status(400).send("New password must be at least 6 characters long");  
        //     }  
        //     const salt = await bcrypt.genSalt(10);  
        //     user.password = await bcrypt.hash(newpassword, salt); // Update user password  
        // }  

        // Handle image uploads  
        if (profileImg) {  
            if (user.profileImg) {  
                await cloudinary.uploader.destroy(user.profileImg.split('/').pop().split('.')[0]);  
            }  
            const uploadResult = await cloudinary.uploader.upload(profileImg);  
            user.profileImg = uploadResult.secure_url; // Update profile image URL  
        }  

        if (coverImg) {  
            if (user.coverImg) {  
                await cloudinary.uploader.destroy(user.coverImg.split('/').pop().split('.')[0]);  
            }  
            const uploadResult = await cloudinary.uploader.upload(coverImg);  
            user.coverImg = uploadResult.secure_url; // Update cover image URL  
        }  

        // Update other user fields  
        // user.fullname = fullname || user.fullname;  
        // user.username = username || user.username;  
        // user.email = email || user.email;  
        user.bio = bio || user.bio;  
        user.link = link || user.link;  

        user = await user.save();  

        res.status(200).send(user);  

    } catch (err) {  
        console.error(err); // Log the error for debugging  
        res.status(500).send("Internal server error"); // Send a generic error message  
    }  
};


module.exports = {getUserProfile,followUnfollowUser,suggestUser,updateUser}