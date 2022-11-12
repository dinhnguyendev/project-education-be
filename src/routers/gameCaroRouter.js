const express = require("express");
const GameCaroController = require("../controllers/GameCaroController");
const router = express.Router();
router.post("/create", GameCaroController.create);
module.exports = router;
