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
module.exports = { createGamesCaro, UpdateWinnerGamesCaro };
