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

const chatGet = async (req, res, next) => {
  try {
    const getres = await Message.findAll({
      attribute: ["message", "time"],
      where: { userId: req.user.id },
    });
    const resArr = [];
    getres.forEach((el) => {
      const obj = {};
      obj.msg = el.message;
      obj.time = el.time;
      resArr.push(obj);
    });
    res.status(200).json(resArr);
  } catch (err) {}
};

module.exports = {
  chatPost,
  chatGet,
};
