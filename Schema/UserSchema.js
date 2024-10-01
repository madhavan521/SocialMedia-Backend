const mongoose = require("mongoose")

const userSchema =  mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        minLength:6
    },
    followers:[
        {
            type:  mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        }  
    ],
    following:[
        {
            type:  mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:[]
        }  
    ],
    profileImg:{
        type:String,
        default:''
    },
    coverImg:{
        type:String,
        default:''
    },
    bio:{
        type:String,
    },
    link:{
        type:String,
    },
    likedpost:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post',
        default:[]
    }] 
})


const User = mongoose.model("User" , userSchema)

module.exports = User