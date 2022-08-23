const express = require('express');
const userRouter=require('./userRouter');
function route(app) {
    app.use('/auth', userRouter);
   
}
module.exports = route;