const ERROR = require("../message/Error");
const GameCaro = require("../models/GameCaro");

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
module.exports = { createGamesCaro };
