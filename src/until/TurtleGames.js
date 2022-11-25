const ERROR = require("../message/Error");
const GameTurtle = require("../models/GameTurle");

const createGamesTurtle = async (data) => {
  const { idUser, addressWallet, coin, bet } = data;
  if (idUser && addressWallet && coin && bet) {
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
const UpdateWinnerGamesTurtle = async (data) => {
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
module.exports = { createGamesTurtle, UpdateWinnerGamesTurtle };
