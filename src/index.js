const express =require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const database=require('./config/database/index');
const route = require('./routers/rootRouter');
const app =express();
const sockets=require('./socket/index');

dotenv.config();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use("/scripts",express.static(__dirname+"../node_modules/web3.js-browser/build/"));
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });
database.connect();
const PORT=process.env.PORT || 5000;
app.use(bodyParser.urlencoded({extended:false}));
route(app);
sockets.socketListen(io);
server.listen(PORT,()=>{
    console.log(`Example app listening at http://localhost
    :${PORT}`);
});
