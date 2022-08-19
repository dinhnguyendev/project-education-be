const express =require('express');
const app =express();
const server =require("http").Server(app);
const io =require("socket.io")(server);
function socketListen(){
    io.on("connection",function(socket){
        console.log("con nguoi ket nois"+socket.id  );
    });

};
module.exports={socketListen};