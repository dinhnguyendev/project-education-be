const express = require("express");
const GameTurtleController = require("../controllers/GameTurtleController");
const router = express.Router();
router.post("/create", GameTurtleController.create);
module.exports = router;
