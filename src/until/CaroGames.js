const { cloneDeep } = require("lodash");
const ERROR = require("../message/Error");
const GameBroad = require("../models/GameBroad");
const GameCaro = require("../models/GameCaro");
const { initGameCaro } = require("./Until");

const createGamesCaro = async (data) => {
  const { idRooms, idUser, addressWallet, totalCoin, coin } = data;
  if (idRooms && idUser && addressWallet && totalCoin && coin) {
    const gameData = {
      idRooms,
      totalCoin,
      coin,
      idUser,
      addressWallet,
    };
    const CreateGame = await GameCaro.create(gameData);
    return CreateGame;
  } else {
    return ERROR.VALUEEMPTY;
  }
};
const UpdateWinnerGamesCaro = async (data) => {
  const { idRooms, idUser, addressWallet, totalCoin, coin } = data;
  if (idRooms && idUser && addressWallet && totalCoin && coin) {
    const GamesItem = await GameCaro.find({
      idRooms,
    });
    console.log("GamesItem");
    console.log(GamesItem);
    if (GamesItem) {
      GamesItem.forEach(async (games) => {
        games.winner.id = idUser;
        games.winner.addressWallet = addressWallet;

        await games.save();
      });
      return true;
    }
  } else {
    return false;
  }
};
const createGameBroad = async (idRooms, data) => {
  if (idRooms) {
    await GameBroad.create({
      idRooms: data?.idRooms,
      gameBoard: data,
    });
  }
};
const deleteGameBroad = async (idRooms) => {
  if (idRooms) {
    await GameBroad.findOneAndDelete({
      idRooms,
    });
  }
};
const updateCheckGameBroad = async (data) => {
  console.log(data);
  let games = await GameBroad.findOne({ idRooms: data?.idRooms });
  if (games) {
    const gameList = cloneDeep(games.gameBoard);
    if (gameList[data.y][data.x] == null) {
      const isClick = data.isX ? "x" : "o";
      gameList[data.y][data.x] = isClick;
      let gamesItems = await GameBroad.findOneAndUpdate(
        { idRooms: data?.idRooms },
        {
          gameBoard: gameList,
        },
        { new: true }
      );
      return gamesItems;
    } else {
      return false;
    }
  } else {
    console.log("create game");
    let itemData = initGameCaro();
    itemData[data.y][data.x] = data.isX ? "x" : "o";
    const gamesItemCreate = await GameBroad.create({
      idRooms: data?.idRooms,
      gameBoard: itemData,
    });
    return gamesItemCreate;
  }
};
module.exports = {
  createGamesCaro,
  UpdateWinnerGamesCaro,
  updateCheckGameBroad,
  createGameBroad,
  deleteGameBroad,
};
