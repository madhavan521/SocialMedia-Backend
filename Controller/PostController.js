const cloudinary = require("cloudinary").v2;
const User = require("../Schema/UserSchema")
const post = require("../Schema/PostSchema");
const notification = require("../Schema/NotificatonSchema");


const createpost =async(req,res)=>{
    try{
        const {text} = req.body
        let{ img }= req.body
        const userId = req.user._id.toString()

 const user = await User.findById(userId)
 if(!user){
    return res.status(404).send("User not found")
 }
 if(!text && !img){
    return res.status(400).send("Post must contain text or image")
 }
 if(img){
    const uploadResult = await cloudinary.uploader.upload(img)
    img = await uploadResult.secure_url
 }
const newPost = new post( {
    user:user._id,
    text,
    img
})
await newPost.save()
res.status(200).send(newPost)

    }
    catch(err){
        console.error(err)
        res.status(500).send({message : err.message})
    }

}
const deletepost = async (req, res) => {   

    try {  
        const { id } = req.params;  
        const userId = req.user._id.toString();  
        const postdata = await post.findById(id); 
        
        if (!postdata) {  
            return res.status(404).send("Post is not found");  
        }  
        
        if (postdata.user._id.toString() !== userId) { 
            return res.status(403).send("Access denied to delete the post"); 
        }  
        
        await post.findByIdAndDelete(id); // Capitalized Post  
        res.status(200).send("Post deleted successfully");  

    } catch (err) {  
        console.error(err);  
        res.status(500).send({ message: err.message });  
    }  
}
const commentpost = async(req,res)=>{

    try{
        const {id} = req.params
        const userId = req.user._id
        const {text}=req.body
   const postdata = await post.findById(id)
   if(!postdata){
    return res.status(400).send("post is not found")
   }

   if(!text){
    return res.status(400).send("text is rquired")
   }
   const commentdata ={user:userId ,text};
   postdata.comments.push(commentdata)
   await postdata.save()

   res.status(200).send(postdata)


    }
    catch(err){
        console.error(err)
        res.status(500).send({message : err.message})
    }

}
const likepost = async(req,res)=>{
    try{
       const userId = req.user.id
       const {id} = req.params

       const postdata = await post.findById(id)
       if(!postdata){
        return res.status(400).send("post not found")
       }
    const likepostdata = postdata.likes.includes(userId)
    if(likepostdata)
    {
         await post.updateOne({_id:id},{$pull : {likes:userId}})
         await User.updateOne({_id:userId},{$pull:{likedpost:id}})
     return   res.status(200).send("unliked Successfully")
    }
else{
    postdata.likes.push(userId)
    await User.updateOne({_id:userId},{$push:{likedpost:id}})
    await postdata.save()


    const notificationdata = new notification ({
        from:userId,
        to:postdata.user,
        type:"like"
    })

    await notificationdata.save()
  return  res.status(200).send("You have like the post ")
}
    }
    catch(err){
        console.error(err)
        res.status(500).send("Internal Server Error")
    }
}
const getAllpost = async(req,res)=>{
    try{
        const allPost = await post.find().sort({createdAt : -1})
        .populate({
            path:"user",
            select:"-password"
        })
        .populate({
            path:"comments.user",
            select:"-password"
        })

if(allPost.length === 0){
    return res.status(404).send("No post avaliable")
}

        res.status(200).send(allPost)
    }
    catch(err){
        console.error(err)
        res.status(500).send({message:err.message})
    }

}
const likedpost = async(req,res)=>{
    try{
        const {id}= req.params
        const userdata = await User.findById(id)
        if(!userdata){
            return res.status(404).send("User not found")
        }
        const likespost = await post.find({_id: {$in:userdata.likedpost}})
        .populate({
            path:"user",
            select:"-password"
        })
        .populate({
            path:"comments.user",
            select:"-password"
        })
        res.status(200).send(likespost)

    }
    catch(err){
        console.error(err)
        res.status(500).send({message : err.message})
    }

}
const feedpost=async(req,res)=>{
    try{
        const {id}= req.params
        const userdata = await User.findById(id)
        if(!userdata){
            return res.status(404).send("User not found")
        }
        const following = userdata.following
        if(!following || following.length===0){

            return res.status(404).send("no following")
        }
        const feedpost = await post.find({user: {$in:following}}).sort({createdAt : -1})
        .populate({
            path:"user",
            select:"-password"
        })
        .populate({
            path:"comments.user",
            select:"-password"
        })
        res.status(200).send(feedpost)

    }
    catch(err){
        console.error(err)
        res.status(500).send({message : err.message})
    }

}
const getUserpost = async(req,res)=>{
    try {  
        const { username } = req.params;   
        const userdata = await User.findOne({ username }); 
    
        if (!userdata) { 
            return res.status(404).send("User not found");  
        }   
        const getuserdata = await post.find({ user: userdata._id })   
            .sort({ createdAt: -1 })  
            .populate({  
                path: "user",  
                select: "-password"  
            })  
            .populate({  
                path: "comments.user",  
                select: "-password"  
            });  
    
        res.status(200).send(getuserdata);  
    } catch (err) {  
        console.error(err);  
        res.status(500).send({ message: err.message });  
    }
}

module.exports ={ createpost,deletepost,commentpost,likepost,getAllpost,likedpost,feedpost,getUserpost}