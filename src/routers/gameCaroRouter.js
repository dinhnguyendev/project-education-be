const express = require("express");
const GameCaroController = require("../controllers/GameCaroController");
const router = express.Router();
router.post("/create", GameCaroController.create);
router.get("/get/games-broad/:id", GameCaroController.getGamesBroad);
module.exports = router;
