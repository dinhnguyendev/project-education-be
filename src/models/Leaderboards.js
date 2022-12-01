const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Leaderboards = new Schema(
  {
    totalCoin: {
      type: Number,
      default: 0,
    },
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    collection: "leaderboards",
    timestamps: true,
  }
);
module.exports = mongoose.model("leaderboards", Leaderboards);
