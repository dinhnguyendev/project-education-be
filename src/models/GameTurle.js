const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const GameTurtle = new Schema(
  {
    idRooms: {
      type: String,
      required: true,
    },
    players: [
      {
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
        bet: {
          type: String,
          required: true,
        },
      },
    ],
    playersWinner: [],
    winnerBet: {
      type: String,
      required: false,
      default: "",
    },
  },
  {
    collection: "gameturtle",
    timestamps: true,
  }
);
module.exports = mongoose.model("gameturtle", GameTurtle);
