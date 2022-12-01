const Leaderboards = require("../models/Leaderboards");

const hanldeLeaderboards = async (idUser, coin) => {
  if (idUser && coin) {
    const items = await Leaderboards.findOne({ idUser });
    console.log(items);
    if (items) {
      const win = +coin;
      items.totalCoin = items.totalCoin + win;
      const res = await items.save();
    } else {
      await Leaderboards.create({
        idUser,
        totalCoin: coin,
      });
    }
  }
};

module.exports = { hanldeLeaderboards };
