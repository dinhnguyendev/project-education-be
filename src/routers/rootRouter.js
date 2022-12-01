const express = require("express");
const userRouter = require("./userRouter");
const gameCaroRouter = require("./gameCaroRouter");
const gameTurtleRouter = require("./gameTurtle");
const game = require("./game");
function route(app) {
  app.use("/auth", userRouter);
  app.use("/games/caro", gameCaroRouter);
  app.use("/games/turtle", gameTurtleRouter);
  app.use("/games", game);
}
module.exports = route;
