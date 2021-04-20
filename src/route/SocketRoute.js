const express = require("express");
const router = express.Router();

const { SocketController } = require("./../controllers");

const { sendMessage, getMessages, clearMessage } = SocketController;

router.get("/", getMessages);
router.post("/", sendMessage);
router.get("/clear", clearMessage);

module.exports = router;
