const GameCaro = require("../models/GameCaro");

class GameCaroController {
  async create(req, res) {
    const { idRooms, idUser, addressWallet, total, bet } = req.body;
    if (idRooms) {
      const game = await GameCaro.findOne({ idRooms });
      if (game) {
        const reqData = {
          id: idUser,
          addressWallet,
        };
        game.infor.push(reqData);
        await game.save();
        return res.status(200).json(game);
      } else {
        const gameData = {
          idRooms,
          total,
          bet,
          infor: [
            {
              id: idUser,
              addressWallet,
            },
          ],
        };
        const CreateGame = await GameCaro.create(gameData);
        return res.status(200).json(CreateGame);
      }
    }
  }
}
module.exports = new GameCaroController();
