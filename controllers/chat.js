const Message = require("../model/chat");

const chatPost = async (req, res, next) => {
  try {
    await Message.create({
      message: req.body.msg,
      time: req.body.time,
      userId: req.user.id,
    });
    res.status(201).json("message sent successfully");
  } catch (err) {
    res.status(500).json({ err, msg: "server error" });
  }
};

module.exports = {
  chatPost,
};
