const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const GameTurtle = new Schema(
  {
    // idRooms: {
    //   type: String,
    //   required: true,
    // },
    // totalCoin: {
    //   type: Number,
    //   required: true,
    // },
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
    winner: [
        {
            id: {
                  type: String,
            },
            addressWallet: {
                  type: String,
            },
        },
    ]
  },
  {
    collection: "gameturtle",
    timestamps: true,
  }
);
module.exports = mongoose.model("gameturtle", GameTurtle);
