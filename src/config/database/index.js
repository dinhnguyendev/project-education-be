const mongoose = require('mongoose');
async function connect() {
    await mongoose.connect('mongodb+srv://minigame:nguyenngocdinh@cluster0.ylq6g.mongodb.net/?retryWrites=true&w=majority',{useNewUrlParser:true,useUnifiedTopology:true },function(err){
        if(err){
            console.log("mongodb conect error "+ err)
        }else{
            console.log("mongodb conect sucess")
        }
    });

}
module.exports ={connect};
