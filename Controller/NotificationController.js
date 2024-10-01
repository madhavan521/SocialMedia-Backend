const notification = require("../Schema/NotificatonSchema");

const getNotification = async (req, res) => {  
    try {  
        const userId = req.user._id;  
        
        // Get notifications for the user  
        const notificationdata = await notification.find({ to: userId }).populate({  
            path: "from",  
            select: "username profileImg" // Corrected select syntax  
        });  

        // Mark notifications as read  
        await notification.updateMany({ to: userId }, { read: true });  

        res.status(200).send(notificationdata);  
    } catch (err) {  
        console.error(err);  
        res.status(500).send({ message: err.message });  
    }  
}
const deleteNotification = async(req,res)=>{
    try{
     const userId = req.user._id;
     await notification.deleteMany({to:userId})
     res.status(200).send("all notification deleted Succesfully")

    }
    catch(err){
        console.error(err)
        res.status(500).send({message:err.message})
    }
}
module.exports ={getNotification,deleteNotification}