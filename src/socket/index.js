const { v4: uuidv4 } = require("uuid");
const { random_item, listArray, initGameCaro, checkWin } = require("../until/Until");
const _ = require("lodash");
const { createGamesCaro, UpdateWinnerGamesCaro } = require("../until/CaroGames");
const { createContractPeerGames } = require("../until/contract");
const Web3 = require("web3");
const { BLOCKCHAIN } = require("../constants/contants");
const { handleWinnerToken, handleWinnerTokenTurtle } = require("../until/handleWinner");
const { cloneDeep, clone } = require("lodash");
const { UpdateWinnerGamesTurtle } = require("../until/TurtleGames");

var Tx = require("ethereumjs-tx").Transaction;
let gameBoard = {};
let userPlayerList = [];
let chatRoomCaro = {};
const row = 50;
const col = 50;
let timer = {};
const currentCheckSendToken = {};
let currentTimer = {};

//turtle
let idTimerTurtle = {};
let winner = {};
let idTimerTurtleDelay = {};
let TimmerTurtle = {};
let TimmerDelay = {};
const ListRooms = [];
const idRoomsTurtle = {
  status: false,
  idRooms: "",
};
const minCurrent = 5;
const maxCurrent = 30;
const timerEnd = 10;
const currentD = 1070;
const currentDHidden = 1200;
const handleCreateRoomsTurtle = () => {
  idRoomsTurtle.idRooms = uuidv4();
  idRoomsTurtle.status = true;
  TimmerTurtle[idRoomsTurtle?.idRooms] = 60;
  idTimerTurtle[idRoomsTurtle?.idRooms] = null;
  winner[idRoomsTurtle?.idRooms] = {
    WIN_I: null,
    WIN_II: null,
    WIN_III: null,
  };
};
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function socketListen(io) {
  io.on("connection", function (socket) {
    console.log("con nguoi ket noi     " + io.engine.clientsCount);
    const numberConect = io.engine.clientsCount;
    socket.broadcast.emit("server--connection--count", numberConect);
    socket.on("client--check--connection--count", () => {
      const numberConect = io.engine.clientsCount;
      socket.broadcast.emit("server--connection--count", numberConect);
    });
    socket.on("reconnect", () => {
      console.log("reconnect");
    });
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
          for (let i = 0; i < userListFirst.length; i++) {
            for (let j = 1; j < userListFirst.length; j++) {
              const infor1 = io.sockets.sockets.get(userListFirst[i])?.datas?._id;
              const infor2 = io.sockets.sockets.get(userListFirst[j])?.datas?._id;
              if (infor1 !== infor2) {
                const respon = {
                  idRooms,
                  coin: data.coin,
                };
                io.to(`${userListFirst[i]}`)
                  .to(`${userListFirst[j]}`)
                  .emit("server--join--rooms", respon);
                return true;
              }
            }
          }
        }
      }
    });
    socket.on("client--join-rooms", (idRooms) => {
      console.log("client--join-rooms");
      console.log(idRooms);
      socket.join(idRooms);
    });
    socket.on("client--leave-room-caro", (data) => {
      const idRooms = data.idRooms;
      const players = socket.players;
      socket.leave("caro" + data.coin);
      socket.join(idRooms);
      gameBoard[idRooms] = initGameCaro();
      chatRoomCaro[idRooms] = [];
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
    socket.on("update--check--caro", async (data) => {
      const idRooms = data.room;
      if (gameBoard[`${idRooms}`] && gameBoard[`${idRooms}`][data.y][data.x] == null) {
        gameBoard[`${idRooms}`][data.y][data.x] = data.isX ? "x" : "o";
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
        const isWin = checkWin(gameBoard[data.room], row, col, data.y, data.x);
        if (isWin) {
          console.log("WINNER: " + data.id);
          console.log(data);
          const isUpdate = await UpdateWinnerGamesCaro(data);
          if (isUpdate) {
            const amount = +data?.totalCoin * 0.9;
            const res = {
              ...data,
              coinWinner: amount,
            };
            io.in(data.idRooms).emit("server--winner--game-caro", res);
            handleWinnerToken(
              BLOCKCHAIN.ABI__GAMES__CARO,
              BLOCKCHAIN.ADDRESS__SM__GAMES,
              data?.addressWallet,
              amount
            );
          }
        }
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
    socket.on("client--leave--room--by-id", (id) => {
      console.log("client--leave--room--by-id : " + id);
      socket.leave(id);
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
      // handleWinnerToken(
      //   BLOCKCHAIN.ABI__GAMES__CARO,
      //   BLOCKCHAIN.ADDRESS__SM__GAMES,
      //   "0xF60E4C205a8853D893c57B5C0649c2f0Df3cbbD3",
      //   0.05
      // );
    });
    socket.on("client--send-token-success", (data) => {
      console.log("client--send-token-success");

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
    });
    const handleTurtleStartTimerGames = (game) => {
      let curentTimer = 60;
      let curentId = setInterval(() => {
        curentTimer = curentTimer - 1;

        io.in(game?.idRooms).emit("server--turtle--watting", curentTimer);
        if (curentTimer == 20) {
          const items = cloneDeep(game);
          handleTurtleDelayDisable(items);
          ListRooms.push(game);
          idRoomsTurtle.idRooms = "";
          idRoomsTurtle.status = false;
        }
        if (curentTimer == 0) {
          clearInterval(curentId);
        }
      }, 1000);
    };
    const handleTurtleDelayDisable = (game) => {
      let numbers = 20;
      let curentId = setInterval(() => {
        let curentTimer = numbers--;

        io.in(game?.idRooms).emit("server--turtle--watting", curentTimer);
        io.in(game?.idRooms).emit("server--turtle--idrooms", true);
        if (curentTimer == 0) {
          clearInterval(curentId);
          const imtemsRun = cloneDeep(game);
          handleDelayRun(imtemsRun);
        }
      }, 1000);
    };

    socket.on("join--room-turtle", () => {
      console.log("join--room-turtle");
      console.log(ListRooms);
      console.log(idRoomsTurtle);
      const idRooms = idRoomsTurtle.idRooms;
      const status = idRoomsTurtle.status;
      if (status && idRooms) {
        socket.join(idRooms);
        socket.emit("server--join--room-uid", idRooms);
      } else {
        console.log("create rooms ");
        handleCreateRoomsTurtle();
        socket.join(idRoomsTurtle.idRooms);
        socket.emit("server--join--room-uid", idRoomsTurtle.idRooms);
        const items = cloneDeep(idRoomsTurtle);
        handleTurtleStartTimerGames(items);
      }
      socket.emit("server--turtle--idrooms", false);
      // if (io.sockets.adapter.rooms.get("turtle")) {
      //   const size = io.sockets.adapter.rooms.get("turtle").size;
      //   socket.broadcast.emit("server--connection--count--turtle", size);
      // } else {
      //   socket.broadcast.emit("server--connection--count--turtle", 0);
      // }
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
      console.log(idRoomsTurtle);
      idTimerTurtle[idRoomsTurtle?.idRooms] = setInterval(() => {
        const curentTimer = TimmerTurtle[idRoomsTurtle?.idRooms]--;
        io.in(idRoomsTurtle?.idRooms).emit("server--turtle--watting", curentTimer);
        if (curentTimer == 0) {
          clearInterval(idTimerTurtle);
          TimmerTurtle[idRoomsTurtle?.idRooms] = 60;
        }
      }, 1000);
    });
    socket.on("turtle--token--winner", (data) => {
      handleTranferTokenGameTurtle(data);
    });

    const handleDelayRun = (game) => {
      let number = 10;
      let idTimerTurtleDelay = setInterval(() => {
        console.log(game);
        number = number - 1;
        io.in(game?.idRooms).emit("server--turtle--run--timer", number);
        if (number == 0) {
          const imtemRunStart = cloneDeep(game);
          handleRunTurtleYellow(imtemRunStart);
          handleRunTurtlePink(imtemRunStart);
          handleRunTurtleBlue(imtemRunStart);
          clearInterval(idTimerTurtleDelay);
        }
      }, 1000);
    };
    const handleTranferTokenGameTurtle = async (data) => {
      if (data) {
        console.log("turtle--token--winner");
        console.log(data);
        const betWin = data?.WIN_I.toString();
        const req = {
          idRooms: data?.idRooms,
          bet: betWin.trim(),
        };
        const res = await UpdateWinnerGamesTurtle(req);
        if (res) {
          const winner = res.playersWinner;
          console.log("turtle--token--winner--res");
          console.log(res);
          if (winner) {
            winner.forEach(async (winners, i) => {
              const amount = +winners.coin * 2;
              const idUser = winners.idUser;
              const addressWallet = winners.addressWallet;
              console.log("winners items");
              const teamp = {
                abi: BLOCKCHAIN.ABI__GAMES__TURTLE,
                addressSM: BLOCKCHAIN.ADDRESS__SM__GAMES__TURTLE,
                coin: amount,
                addreceive: addressWallet,
                idUser,
                indexs: i,
              };
              const request = cloneDeep(teamp);
              handleWinnerTokenTurtle(request);
            });
          }
        }
      }
    };
    const handleRunTurtleYellow = (game) => {
      let responTotal = 0;
      let idInterval = setInterval(() => {
        const resRunBytimmer = getRandomInt(minCurrent, maxCurrent);
        console.log("turtle-next--yellow---------------" + resRunBytimmer);
        responTotal = responTotal + resRunBytimmer;
        io.in(game?.idRooms).emit("turtle-next--yellow", resRunBytimmer);
        if (responTotal >= currentD) {
          if (winner[game.idRooms]) {
            if (!winner[game?.idRooms].WIN_I) {
              winner[game?.idRooms].WIN_I = 1;
            } else if (!winner[game?.idRooms].WIN_II) {
              winner[game?.idRooms].WIN_II = 1;
            } else if (!winner[game?.idRooms].WIN_III) {
              winner[game?.idRooms].WIN_III = 1;
              const res = {
                idRooms: game?.idRooms,
                WIN_I: winner[game?.idRooms].WIN_I,
                WIN_II: winner[game?.idRooms].WIN_II,
                WIN_III: winner[game?.idRooms].WIN_III,
              };
              io.in(game?.idRooms).emit("turtle-winner", res);
              const req = cloneDeep(res);
              handleTranferTokenGameTurtle(req);
            }
          }
          clearInterval(idInterval);
        }
      }, [500]);
    };
    const handleRunTurtlePink = (game) => {
      let responTotal = 0;
      let idInterval = setInterval(() => {
        const resRunBytimmer = getRandomInt(minCurrent, maxCurrent);
        responTotal = responTotal + resRunBytimmer;
        io.in(game?.idRooms).emit("turtle-next--pink", resRunBytimmer);
        if (responTotal >= currentD) {
          if (winner[game.idRooms]) {
            if (!winner[game?.idRooms].WIN_I) {
              winner[game?.idRooms].WIN_I = 2;
            } else if (!winner[game?.idRooms].WIN_II) {
              winner[game?.idRooms].WIN_II = 2;
            } else if (!winner[game?.idRooms].WIN_III) {
              winner[game?.idRooms].WIN_III = 3;
              const res = {
                idRooms: game?.idRooms,
                WIN_I: winner[game?.idRooms].WIN_I,
                WIN_II: winner[game?.idRooms].WIN_II,
                WIN_III: winner[game?.idRooms].WIN_III,
              };
              io.in(game?.idRooms).emit("turtle-winner", res);
              const req = cloneDeep(res);
              handleTranferTokenGameTurtle(req);
            }
          }
          clearInterval(idInterval);
        }
      }, [500]);
    };
    const handleRunTurtleBlue = (game) => {
      let responTotal = 0;
      let idInterval = setInterval(() => {
        const resRunBytimmer = getRandomInt(minCurrent, maxCurrent);
        responTotal = responTotal + resRunBytimmer;
        io.in(game?.idRooms).emit("turtle-next--blue", resRunBytimmer);
        if (responTotal >= currentD) {
          if (winner[game.idRooms]) {
            if (!winner[game?.idRooms].WIN_I) {
              winner[game?.idRooms].WIN_I = 3;
            } else if (!winner[game?.idRooms].WIN_II) {
              winner[game?.idRooms].WIN_II = 3;
            } else if (!winner[game?.idRooms].WIN_III) {
              winner[game?.idRooms].WIN_III = 3;
              const res = {
                idRooms: game?.idRooms,
                WIN_I: winner[game?.idRooms].WIN_I,
                WIN_II: winner[game?.idRooms].WIN_II,
                WIN_III: winner[game?.idRooms].WIN_III,
              };
              io.in(game?.idRooms).emit("turtle-winner", res);
              const req = cloneDeep(res);
              handleTranferTokenGameTurtle(req);
            }
          }
          clearInterval(idInterval);
        }
      }, [500]);
    };
    const handleTrasferTokenWinner = (data) => {
      const { amount, addressWallet } = data;
      handleWinnerToken(
        BLOCKCHAIN.ABI__GAMES__TURTLE,
        BLOCKCHAIN.ADDRESS__SM__GAMES__TURTLE,
        addressWallet,
        amount
      );
    };

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
