const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/rooms-chat.controller');
const roomsChatValidate = require("../../validates/client/rooms-chat.validate");


router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create",roomsChatValidate.createRoom, controller.createPost);


module.exports = router;