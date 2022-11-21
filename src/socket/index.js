const { v4: uuidv4 } = require("uuid");
const { random_item, listArray, initGameCaro, checkWin } = require("../until/Until");
const _ = require("lodash");
const { createGamesCaro } = require("../until/CaroGames");
const { createContractPeerGames } = require("../until/contract");
const Web3 = require("web3");
const { BLOCKCHAIN } = require("../constants/contants");
var Tx = require("ethereumjs-tx").Transaction;
let gameBoard = {};
let userPlayerList = [];
let chatRoomCaro = {};
const row = 20;
const col = 20;
let timer = {};
const currentCheckSendToken = {};
let currentTimer = {};
function socketListen(io) {
  io.on("connection", function (socket) {
    console.log("con nguoi ket noi     " + io.engine.clientsCount);
    const numberConect = io.engine.clientsCount;
    socket.broadcast.emit("server--connection--count", numberConect);
    socket.on("client--check--connection--count", () => {
      const numberConect = io.engine.clientsCount;
      console.log("dooodasdjhasdjadsjahdj");
      console.log(numberConect);
      socket.broadcast.emit("server--connection--count", numberConect);
    });
    socket.on("reconnect", () => {
      console.log("reconnect");
    });
    // console.log(socket.players);
    socket.on("client", (data) => {
      io.sockets.emit("server", data + " 8888   ");
    });
    socket.on("join-room", async (data) => {
      if (data.coin) {
        socket.join("caro" + data.coin);
        socket.datas = data;
        const size = io.sockets.adapter.rooms.get("caro" + data.coin).size;
        if (size >= 2) {
          const idRooms = uuidv4();
          const roomsFirst = socket.adapter.rooms.get("caro" + data.coin);
          const userListFirst = listArray(roomsFirst);
          const user1 = userListFirst[0];
          const user2 = userListFirst[1];
          const respon = {
            idRooms,
            coin: data.coin,
          };
          io.to(`${user1}`).to(`${user2}`).emit("server--join--rooms", respon);
        }
      }
    });
    socket.on("client--leave-room-caro", (data) => {
      const idRooms = data.idRooms;
      const players = socket.players;
      socket.leave("caro" + data.coin);
      socket.join(idRooms);
      gameBoard[idRooms] = initGameCaro();
      chatRoomCaro[idRooms] = [];
      // console.log(gameBoard);
      userPlayerList[idRooms] = userPlayerList[idRooms] || [];
      userPlayerList[idRooms].push({
        id: socket.id,
        user: players,
      });

      const size = io.sockets.adapter.rooms.get(idRooms).size;

      if (size === 2) {
        const lengthList = size - 1;
        for (let i = lengthList; i >= 0; i--) {
          let respon = {
            idRooms: idRooms,
            id: userPlayerList[idRooms][i].id,
            isMyTurn: i == lengthList ? true : false,
            isX: i == lengthList ? true : false,
            coin: data.coin,
            totalCoin: data.coin * 2,
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
          io.to(userPlayerList[idRooms][i].id).emit("server--rooms--sucessfylly", respon);
        }
      }
    });
    socket.on("update--check--caro", (data) => {
      const idRooms = data.room;
      // console.log(idRooms);
      if (gameBoard[`${idRooms}`][data.y][data.x] == null) {
        gameBoard[`${idRooms}`][data.y][data.x] = data.isX ? "x" : "o";
        const isWin = checkWin(gameBoard[data.room], row, col, data.y, data.x);
        if (isWin) {
          console.log("WINNER: " + data.id);
          console.log(data);
        }
        let responRoom = {
          x: data.x,
          y: data.y,
          isX: data.isX,
          phone: data.phone,
        };
        io.in(idRooms).emit("server--update-check", responRoom);
        const phone = data.phone;
        io.in(idRooms).emit("server--timer-IsSuccess", {
          isBoolean: true,
          phone,
          room: idRooms,
        });
      } else {
        const data = "Ô đã được đánh !";
        socket.emit("server--notification-message", data);
      }
    });
    socket.on("client--timer-update", (data) => {
      const idRooms = data.room;
      if (!timer[idRooms]) {
        timer[idRooms] = {
          currenInterval: null,
        };
      }
      currentTimer[idRooms] = 20;
      clearInterval(timer[idRooms].currenInterval);
      timer[idRooms].currenInterval = setInterval(() => {
        currentTimer[idRooms]--;
        io.in(idRooms).emit("server--time--watting", currentTimer[idRooms]);
        if (currentTimer[idRooms] == 0) {
          clearInterval(timer[idRooms].currenInterval);
          currentTimer[idRooms] = 20;
          io.in(idRooms).emit("server--watting--end", data.phone);
        }
      }, 1000);
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
      io.in(data.idRooms).emit("server--chat--caro--message", chatRoomCaro[data.idRooms]);
    });
    socket.on("client--leave--room", (coin) => {
      socket.leave("caro" + coin);
    });
    socket.on("client--leave--room--error", (data) => {
      socket.leave(data.idRooms);
    });
    socket.on("client--chat-room-caro--typing", (data) => {
      io.in(data.idRooms).emit("server--chat--caro--typing", data);
    });
    socket.on("client--chat-room-caro--off-typing", (data) => {
      io.in(data.idRooms).emit("server--chat--caro--off-typing", data);
    });
    socket.on("client-transfer-token--error", (data) => {
      if (data) {
        io.in(data.idRooms).emit("server--transfer-error", data);
      }
    });
    socket.on("server-transfer-token--automation", async () => {
      console.log("server-transfer-token--automation");
      const abi = BLOCKCHAIN.ABI;
      const addressSM = BLOCKCHAIN.ADDRESS__SM__PEER;
      // const privateKey = "d593ca8e89c4b870938d7107ee53dcbb8cfe3667ef0861cc771163fb193cb8f5"

      const web3 = new Web3(
        new Web3.providers.WebsocketProvider(
          "wss://goerli.infura.io/ws/v3/b1706c239ae04b86a36b141b34796c73"
        )
      );
     
      web3.eth.accounts.wallet.add("d593ca8e89c4b870938d7107ee53dcbb8cfe3667ef0861cc771163fb193cb8f5");
      const contract = new web3.eth.Contract(abi, addressSM);
      const privateKey = Buffer.from(
        "d593ca8e89c4b870938d7107ee53dcbb8cfe3667ef0861cc771163fb193cb8f5",
        "hex"
        );
        // web3.eth.defaultChain = 'goerli';
      // const txsss =contract.methods
      // .updateAllowancesRecive(
      //   "0x46F16f01FeF8cd5A60abF783c470e6558aFBDC87"
      // )
      // const gas = await txsss.estimateGas({ from: "0x78E02ebEed978b82B4479a765D0c7f579f25ee38" })
      // const gasPrice = await web3.eth.getGasPrice();
      // const data = txsss.encodeABI();
      const nonce = await web3.eth.getTransactionCount("0x78E02ebEed978b82B4479a765D0c7f579f25ee38");
      const accountNonce =
  '0x' +(+nonce +1).toString(16)
      var txParams = {
        from: "0x78E02ebEed978b82B4479a765D0c7f579f25ee38",
        to: "0x6C26557f69A7bb7ea4834376c1669F57eFA26555",
        data: contract.methods
        .updateAllowancesRecive(
          "0x46F16f01FeF8cd5A60abF783c470e6558aFBDC87"
        ).encodeABI(),
        gas: 30000,
        nonce: accountNonce,

       
      };
      const tx = new Tx(txParams,{'chain':'goerli'});
      tx.sign(privateKey);
      const serializedTx = tx.serialize();
      console.log("0x" + serializedTx.toString("hex"));
      // const res = await web3.eth.accounts.signTransaction(txParams, privateKey);
      console.log(accountNonce);
      console.log(`Old data value: ${await contract.methods.balanceOf("0x78E02ebEed978b82B4479a765D0c7f579f25ee38").call()}`);
      // web3.eth
      //   .sendSignedTransaction(res.rawTransaction)
      //   .on("receipt", (receipt) => {
      //     console.log(receipt);
          
      //   })
      //   .on("error", (err) => {
      //     console.log(err);
      //   });
      web3.eth
        .sendSignedTransaction("0x" + serializedTx.toString("hex"))
        .on("receipt", (receipt) => {
          console.log(receipt);
          
        })
        .on("error", (err) => {
          console.log(err);
        });
    });
    socket.on("client--send-token-success", (data) => {
      console.log("client--send-token-success");
      // console.log(data);
      const isCheckSend = _.get(currentCheckSendToken, data.idRooms);
      if (isCheckSend) {
        currentCheckSendToken[data.idRooms].push(data);
        createGamesCaro(data);
        const dataUser = currentCheckSendToken[data.idRooms];
        io.in(data.idRooms).emit("server--navigate--game-broad", dataUser);
      } else {
        currentCheckSendToken[data.idRooms] = [];
        currentCheckSendToken[data.idRooms].push(data);
        createGamesCaro(data);
      }
      console.log(currentCheckSendToken);
    });

    //turtle
    let idTimerTurtle;
    let TimmerTurtle = 3;
    let idTimerTurtleDelay;
    let TimmerDelay = 6;

    socket.on("join--room-turtle", () => {
      console.log("join--room-turtle");
      socket.join("turtle");
      if (io.sockets.adapter.rooms.get("turtle")) {
        const size = io.sockets.adapter.rooms.get("turtle").size;
        socket.broadcast.emit("server--connection--count--turtle", size);
      } else {
        socket.broadcast.emit("server--connection--count--turtle", 0);
      }
    });
    socket.on("client--check--connection--count--turtle", () => {
      if (io.sockets.adapter.rooms.get("turtle")) {
        const size = io.sockets.adapter.rooms.get("turtle").size;
        socket.broadcast.emit("server--connection--count--turtle", size);
      } else {
        socket.broadcast.emit("server--connection--count--turtle", 0);
      }
    });

    socket.on("turtle-start", () => {
      idTimerTurtle = setInterval(() => {
        const curentTimer = TimmerTurtle--;
        io.in("turtle").emit("server--turtle--watting", curentTimer);
        if (curentTimer == 0) {
          clearInterval(idTimerTurtle);
          TimmerTurtle = 3;
        }
      }, 1000);
    });
    socket.on("turtle-delay", () => {
      idTimerTurtleDelay = setInterval(() => {
        TimmerDelay = TimmerDelay - 1;
        io.in("turtle").emit("server--turtle--run--timer", TimmerDelay);
        if (TimmerDelay == 0) {
          clearInterval(idTimerTurtleDelay);
          TimmerDelay = 6;
        }
      }, 1000);
    });
    socket.on("turtle-run-game", () => {
      socket.emit("turtle-next");
    });
    socket.on("disconnect", () => {
      console.log("con nguoi ngat ket noi!!!!!!!!!!!!!!!!!! " + socket.id);
      if (io.sockets.adapter.rooms.get("turtle")) {
        const size = io.sockets.adapter.rooms.get("turtle").size;
        socket.broadcast.emit("server--connection--count--turtle", size);
      } else {
        socket.broadcast.emit("server--connection--count--turtle", 0);
      }
      const number = io.engine.clientsCount;
      socket.broadcast.emit("server--connection--count", number);
    });
  });
}
module.exports = { socketListen };
