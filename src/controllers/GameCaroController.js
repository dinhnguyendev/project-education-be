const GameBroad = require("../models/GameBroad");
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
  async getGamesBroad(req, res) {
    const idRooms = req.params.id;
    console.log(idRooms);
    if (idRooms) {
      const result = await GameBroad.findOne({
        idRooms,
      });
      console.log("result");
      console.log(result);
      if (result) {
        return res.status(200).json(result);
      }
    }
  }
}
module.exports = new GameCaroController();
