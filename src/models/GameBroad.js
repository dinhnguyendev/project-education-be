const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const GameBroad = new Schema(
  {
    idRooms: {
      type: String,
      required: true,
    },
    gameBoard: {
      type: Array,
      default: [],
      required: false,
    },
  },
  {
    collection: "gamebroadcaro",
    timestamps: true,
  }
);
module.exports = mongoose.model("gamebroadcaro", GameBroad);
