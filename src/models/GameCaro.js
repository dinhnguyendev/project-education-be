const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const GameCaro = new Schema(
  {
    idRooms: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    bet: {
      type: String,
      required: true,
    },
    infor: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        addressWallet: {
          type: String,
          required: true,
        },
      },
    ],
    winner: {
      id: {
        type: String,
      },
      addressWallet: {
        type: String,
      },
    },
  },
  {
    collection: "gamecaro",
    timestamps: true,
  }
);
module.exports = mongoose.model("gamecaro", GameCaro);
