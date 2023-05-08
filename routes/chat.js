const express = require("express");

const router = express.Router();

const chatController = require("../controllers/chat");
const authorization = require("../middleware/auth");

router.post("/message", authorization, chatController.chatPost);
router.get("/message", authorization, chatController.chatGet);
router.get(
  "/fatchMessage/:lastmsgId",
  authorization,
  chatController.fatchMessage
);

module.exports = router;
