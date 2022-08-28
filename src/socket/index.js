function socketListen(io) {
  io.on("connection", function (socket) {
    console.log("con nguoi ket nois" + socket.id);
    socket.on("client", (data) => {
      console.log(data);
      io.sockets.emit("server", data + " 8888   ");
    });
    socket.on("join-room", (data) => {
      console.log(data);
      socket.join("caro");
      socket.Phong = data;
      console.log(socket.adapter.rooms);
      var array = [];
      for (item in socket.adapter.rooms) {
        array.push(item);
      }
      console.log(array);
    });

    socket.on("disconnect", () => {
      console.log("con nguoi ngat ket noi!!!!!!!!!!!!!!!!!!");
    });
  });
}
module.exports = { socketListen };
