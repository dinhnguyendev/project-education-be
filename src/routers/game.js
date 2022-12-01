const express = require("express");
const GameContronller = require("../controllers/GameContronller");
const router = express.Router();
router.get("/leaderboards", GameContronller.getLeaderboard);
module.exports = router;
