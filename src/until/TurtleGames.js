const ERROR = require("../message/Error");
const GameTurtle = require("../models/GameTurle");

const createGamesTurtle = async (data) => {
  const { idUser, addressWallet, coin, bet, idRooms } = data;
  if (idUser && addressWallet && coin && bet && idRooms) {
    const users = {
      coin,
      idUser,
      addressWallet,
      bet,
    };
    const game = await GameCaro.find({ idRooms });
    if (game) {
      await game.players.push(users);
      const res = await game.save();
      return res;
    } else {
      const CreateGame = await GameCaro.create({
        idRooms,
        players: [users],
      });
      return CreateGame;
    }
  } else {
    return ERROR.VALUEEMPTY;
  }
};
const UpdateWinnerGamesTurtle = async (data) => {
  const { idRooms, bet } = data;
  console.log(data);
  if (idRooms && bet) {
    const GamesItem = await GameTurtle.findOne({
      idRooms,
    });
    console.log("GamesItem");
    console.log(GamesItem);
    if (GamesItem) {
      const winner = await GamesItem?.players?.filter((users) => users.bet === bet);
      console.log("winner");
      console.log(winner);
      if (winner) {
        GamesItem.playersWinner = winner;
      } else {
        GamesItem.playersWinner = [];
      }
      GamesItem.winnerBet = bet;
      const res = await GamesItem.save();
      console.log(res);
      return res;
    }
  } else {
    return false;
  }
};
module.exports = { createGamesTurtle, UpdateWinnerGamesTurtle };
