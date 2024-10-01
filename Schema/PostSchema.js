const mongoose = require("mongoose");  

const postSchema = mongoose.Schema({  
    user: {  
        type: mongoose.Schema.Types.ObjectId,  
        ref: "User",  
        required: true  
    },  
    text: {  
        type: String  
    },  
    img: {  
        type: String  
    },  
    likes: [{  
        type: mongoose.Schema.Types.ObjectId,  
        ref: "User",  
    }], 
    comments: [  
        {  
            text: {  
                type: String,  
                required: true   
            },  
            user: {  
                type: mongoose.Schema.Types.ObjectId,  
                ref: "User",  
            }  
        }  
    ]  
}, { timestamps: true });  

const post = mongoose.model("Post", postSchema);
module.exports = post; 