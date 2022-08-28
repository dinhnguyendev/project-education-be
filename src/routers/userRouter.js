const express = require('express');
const UserController = require('../controllers/UserController');
const MiddleWare = require('../MiddleWare/MiddleWare');
const router = express.Router();
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/get', UserController.get);
router.get("/logout", MiddleWare.verifiToken, UserController.logout);
module.exports = router;