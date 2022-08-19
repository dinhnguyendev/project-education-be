const express = require('express');
const userRouter=require('./userRouter');
function route(app) {
    app.use('/', userRouter);
   
}
module.exports = route;