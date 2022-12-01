const GameTurle = require("../models/GameTurle");
const CryptoJS = require("crypto-js");

class GameTurtleController {
  async create(req, res) {
    const { idUser, addressWallet, coin, bet, idRooms, privateKey } = req.body;
    if (idUser && addressWallet && coin && bet && idRooms && privateKey) {
      const bytes = CryptoJS.AES.decrypt(privateKey, "nguyenngocdinh");
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      const secret = JSON.parse(originalText);
      if (secret?.ischeckRole) {
        const users = {
          coin,
          idUser,
          addressWallet,
          bet,
        };
        const game = await GameTurle.findOne({ idRooms });
        if (game) {
          await game.players.push(users);
          const result = await game.save();
          return res.status(200).json(result);
        } else {
          const CreateGame = await GameTurle.create({
            idRooms,
            players: [users],
          });
          return res.status(200).json(CreateGame);
        }
      }
    }
  }
}
module.exports = new GameTurtleController();
