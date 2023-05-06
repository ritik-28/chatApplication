const express = require("express");

const router = express.Router();

const chatController = require("../controllers/chat");
const authorization = require("../middleware/auth");

router.post("/message", authorization, chatController.chatPost);
// router.post("/signin", userController.signinPost);

module.exports = router;
