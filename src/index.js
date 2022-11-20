const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const database = require("./config/database/index");
const route = require("./routers/rootRouter");
const app = express();
const sockets = require("./socket/index");
const jwt = require("jsonwebtoken");
const User = require("./models/User");

dotenv.config();
app.use(express.json());
const corsOptions = {
  origin: "http://localhost:3006",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.static("public"));
app.use("/scripts", express.static(__dirname + "../node_modules/web3.js-browser/build/"));
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3006",

    methods: ["GET", "POST"],
  },
});
io.use((socket, next) => {
  const { token } = socket.handshake.headers;
  if (token) {
    jwt.verify(token, process.env.JWT_ACCESS_TOKEN, async (err, user) => {
      if (err) {
        next(new Error("Authentication error"));
      }
      socket.players = user;
      // if (user) {
      //   const users = await User.findOne({ _id: user.id });
      //   if (users) {
      //   }
      // }
      next();

      // next(new Error("Authentication error"));
    });
  } else {
    next();
    // return res.status(403).json(ERROR.TOKENISNOTVALUE);
  }
});
database.connect();
const PORT = process.env.PORT || 5000;
app.use(bodyParser.urlencoded({ extended: false }));
route(app);
sockets.socketListen(io);
server.listen(PORT, () => {
  console.log(`Example app listening at http://localhost
    :${PORT}`);
});
