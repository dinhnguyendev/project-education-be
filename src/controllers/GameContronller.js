const Leaderboards = require("../models/Leaderboards");

class GameContronller {
  async getLeaderboard(req, res) {
    const result = await Leaderboards.find({}).sort({ totalCoin: -1 }).populate("idUser").limit(5);
    return res.status(200).json(result);
  }
}
module.exports = new GameContronller();
