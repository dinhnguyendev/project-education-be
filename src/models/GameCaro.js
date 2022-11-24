const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const GameCaro = new Schema(
  {
    idRooms: {
      type: String,
      required: true,
    },
    totalCoin: {
      type: Number,
      required: true,
    },
    coin: {
      type: String,
      required: true,
    },
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    addressWallet: {
      type: String,
      required: true,
    },
    winner: {
      id: {
        type: String,
        default: "",
      },
      addressWallet: {
        type: String,
        default: "",
      },
    },
  },
  {
    collection: "gamecaro",
    timestamps: true,
  }
);
module.exports = mongoose.model("gamecaro", GameCaro);
