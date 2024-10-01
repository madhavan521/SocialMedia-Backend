const mongoose = require("mongoose")

const databaseConnection=()=>{
    mongoose.connect("mongodb+srv://cmadhavan521:madhavan@cluster0.gkuws.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(()=>{
        console.log("Database Connected Successfully")
    })
    .catch((err)=>{
        console.log(err)
    })
}
module.exports = databaseConnection;

