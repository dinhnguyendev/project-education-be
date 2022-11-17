const GameCaro = require("../models/GameCaro");

class GameCaroController {
  async create(req, res) {
    // const { idRooms, idUser, addressWallet, total, bet } = req.body;
    // if (idRooms && idUser && addressWallet && total && bet) {
    //   const gameData = {
    //     idRooms,
    //     total,
    //     bet,
    //     infor: [
    //       {
    //         id: idUser,
    //         addressWallet,
    //       },
    //     ],
    //   };
    //   const CreateGame = await GameCaro.create(gameData);
    //   return res.status(200).json(CreateGame);
    // } else {
    //   return res.status(200).json(ERROR.VALUEEMPTY);
    // }
  }
}
module.exports = new GameCaroController();
