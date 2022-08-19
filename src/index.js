const express =require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const database=require('./config/database/index');
const route = require('./routers/rootRouter');
const app =express();
const sockets=require('./socket/index');
sockets.socketListen();
dotenv.config();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use("/scripts",express.static(__dirname+"../node_modules/web3.js-browser/build/"));
const server =require("http").Server(app);
const io =require("socket.io")(server);
database.connect();
const PORT=process.env.PORT || 5000;
app.use(bodyParser.urlencoded({extended:false}));
route(app);
server.listen(PORT,()=>{
    console.log(`Example app listening at http://localhost
    :${PORT}`);
});
io.on("connection",function(socket){
    console.log("con nguoi ket nois" );
});
