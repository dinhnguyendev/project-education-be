const mongoose = require('mongoose');
async function connect() {
    await mongoose.connect(`mongodb+srv://dinhnguyendev:nguyenngocdinh@cluster0.ylq6g.mongodb.net/project-education?retryWrites=true&w=majority`,{useNewUrlParser:true,useUnifiedTopology:true },function(err){
        if(err){
            console.log("mongodb conect error "+ err)
        }else{
            console.log("mongodb conect sucess")
        }
    });

}
module.exports ={connect};
