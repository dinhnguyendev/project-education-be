const express = require("express");
const userRouter = require("./userRouter");
const gameCaroRouter = require("./gameCaroRouter");
function route(app) {
  app.use("/auth", userRouter);
  app.use("/games/caro", gameCaroRouter);
}
module.exports = route;
