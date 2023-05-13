const Message = require("../model/chat");
const { Op } = require("sequelize");

const chatPost = async (req, res, next) => {
  try {
    const newmsg = await Message.create({
      message: req.body.msg,
      time: req.body.time,
      userId: req.user.id,
      groupId: req.body.groupId,
    });
    res.status(201).json({
      res: "message sent successfully",
      id: newmsg.id,
    });
  } catch (err) {
    res.status(500).json({ err, msg: "server error" });
  }
};

const chatGet = async (req, res, next) => {
  try {
    const getres = await Message.findAll({
      attribute: ["id", "message", "time"],
      where: { groupId: req.params.globalGroupNumber },
      order: [["createdAt", "DESC"]],
      limit: 10,
    });
    const resArr = [];
    getres.forEach((el) => {
      const obj = {};
      obj.id = el.id;
      obj.msg = el.message;
      obj.time = el.time;
      resArr.push(obj);
    });
    res.status(200).json(resArr);
  } catch (err) {
    console.log(err);
  }
};

const fatchMessage = async (req, res, next) => {
  try {
    console.log(req.query);
    const getres = await Message.findAll({
      where: {
        [Op.and]: [
          {
            id: {
              [Op.gt]: req.query.lastmsgId,
            },
          },
          {
            groupId: req.query.groupId,
          },
        ],
      },
    });
    if (getres.length !== 0) {
      res.status(200).json({
        res: "fetched succesfully",
        id: getres[0].id,
        msg: getres[0].message,
        time: getres[0].time,
      });
    } else {
      res.status(200).json("no new messages");
    }
  } catch (err) {
    res.status(500).json("no data fetched");
  }
};

module.exports = {
  chatPost,
  chatGet,
  fatchMessage,
};
