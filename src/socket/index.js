const { v4: uuidv4 } = require("uuid");
const {
  random_item,
  listArray,
  initGameCaro,
  checkWin,
} = require("../until/Until");
let gameBoard = {};
let userPlayerList = [];
let chatRoomCaro = {};
const row = 20;
const col = 20;
// console.log("gameBoard");
// console.log(gameBoard);
function socketListen(io) {
  io.on("connection", function (socket) {
    console.log("con nguoi ket noi     " + socket.id);
    // console.log(socket.players);
    socket.on("client", (data) => {
      console.log(data);
      io.sockets.emit("server", data + " 8888   ");
    });
    socket.on("join-room", async (data) => {
      // data,decoded,socketId
      // const isRoomsExits = io.sockets.adapter.rooms.get("caro");
      // if (isRoomsExits) {
      //   const rooms = socket.adapter.rooms.get("caro");
      //   const userList = listArray(rooms);
      //   console.log(userList);
      //   const isExits = userList.includes(socket.decoded.id);
      //   console.log("isExits");
      //   console.log(isExits);
      //   if (isExits) {
      //     return io.sockets.emit(
      //       "server--handle--error",
      //       "tai khoan da dang duoc ket nois"
      //     );
      //   }
      // } else {
      // }

      socket.join("caro");
      socket.datas = data;
      const size = io.sockets.adapter.rooms.get("caro").size;
      if (size >= 2) {
        const idRooms = uuidv4();
        // const idRoomsChat = uuidv4();
        const roomsFirst = socket.adapter.rooms.get("caro");
        const userListFirst = listArray(roomsFirst);
        // const user1 = random_item(userListFirst);
        // const roomsLast = socket.adapter.rooms.get("caro");
        // const userListLast = listArray(roomsLast);
        // const user2 = random_item(userListLast);
        // while (user1 === user2) {
        //   const roomsLast = socket.adapter.rooms.get("caro");
        //   const userListLast = listArray(roomsLast);
        //   const user2 = random_item(userListLast);
        //   if (user1 != user2) break;
        // }
        // console.log(userListFirst);
        const user1 = userListFirst[0];
        const user2 = userListFirst[1];
        io.to(`${user1}`).to(`${user2}`).emit("server--join--rooms", idRooms);
      }
    });
    socket.on("client--leave-room-caro", (idRooms) => {
      const players = socket.players;
      // userPlayerList.push(players);
      // console.log(userPlayerList);
      socket.leave("caro");
      socket.join(idRooms);
      // const idRooms = "idRooms";
      // console.log(idRooms);
      // console.log(typeof idRooms);
      gameBoard[idRooms] = initGameCaro();
      chatRoomCaro[idRooms] = [];
      // console.log(gameBoard);
      userPlayerList[idRooms] = userPlayerList[idRooms] || [];
      userPlayerList[idRooms].push({
        id: socket.id,
        user: players,
      });
      console.log("matrix");
      const size = io.sockets.adapter.rooms.get(idRooms).size;
      console.log(size);
      if (size === 2) {
        const lengthList = size - 1;
        for (let i = lengthList; i >= 0; i--) {
          let respon = {
            idRooms: idRooms,
            id: userPlayerList[idRooms][i].id,
            isMyTurn: i == lengthList ? true : false,
            isX: i == lengthList ? true : false,
            opponent:
              i == lengthList
                ? userPlayerList[idRooms][lengthList - 1].id
                : userPlayerList[idRooms][lengthList].id,
            opponentName:
              i == lengthList
                ? userPlayerList[idRooms][lengthList - 1].user
                : userPlayerList[idRooms][lengthList].user,
          };
          userPlayerList[idRooms][i].isMyTurn = respon.isMyTurn;
          userPlayerList[idRooms][i].isX = respon.isX;
          io.to(userPlayerList[idRooms][i].id).emit(
            "server--rooms--sucessfylly",
            respon
          );
        }
      }
    });
    socket.on("update--check--caro", (data) => {
      console.log("update--check");
      const idRooms = data.room;
      console.log(data);
      // console.log(idRooms);

      gameBoard[`${idRooms}`][data.y][data.x] = data.isX ? "x" : "o";
      // console.log(gameBoard[`${idRooms}`]);
      const isWin = checkWin(gameBoard[data.room], row, col, data.y, data.x);
      if (isWin) {
        console.log("WINNER: " + data.id);
      }
      let responRoom = {
        x: data.x,
        y: data.y,
        isX: data.isX,
        phone: data.phone,
      };
      // const responPlayer = {
      //   isMyTurn: !data.isMyTurn
      // };
      // socket.emit("server--watting--check",responPlayer)
      io.in(idRooms).emit("server--update-check", responRoom);
    });
    socket.on("server--chat-room-caro", (data) => {
      const values = data.values;
      const message = {
        phone: data.phone,
        values,
        username: data.username,
        avatar: data.avatar,
      };
      chatRoomCaro[data.idRooms].push(message);
      io.in(data.idRooms).emit(
        "server--chat--caro--message",
        chatRoomCaro[data.idRooms]
      );
    });
    socket.on("client--chat-room-caro--typing", (data) => {
      io.in(data.idRooms).emit(
        "server--chat--caro--typing",
        data
      );
    });
    socket.on("client--chat-room-caro--off-typing", (data) => {
      io.in(data.idRooms).emit(
        "server--chat--caro--off-typing",
        data
      );
    });
    socket.on("disconnect", () => {
      console.log("con nguoi ngat ket noi!!!!!!!!!!!!!!!!!!");
    });
  });
}
module.exports = { socketListen };
