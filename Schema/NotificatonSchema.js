const mongoose= require("mongoose")

const notificationSchema = mongoose.Schema({
    from:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
   to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    type:{
        type:String,
        require:true,
        enum:['follow','like']
    },
    read:
    {
        type:Boolean,
        default:false
    }

},{timestamps : true})


const notification = mongoose.model('Notification' , notificationSchema)


module.exports = notification