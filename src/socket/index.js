
function socketListen(io){
    io.on("connection",function(socket){
        console.log("con nguoi ket nois"+socket.id  );
        socket.on('disconnect', () => {
            console.log("con nguoi ngat ket noi!!!!!!!!!!!!!!!!!!" );
        });
    });
};
module.exports={socketListen};