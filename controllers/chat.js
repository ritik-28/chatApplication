const Message = require("../model/chat");
var CronJob = require("cron").CronJob;
const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const ArchivedChat = require("../model/ArchivedChat");
const { Op } = require("sequelize");

const chatPost = async (req, res, next) => {
  try {
    const newmsg = await Message.create({
      name: req.user.name,
      message: req.body.msg,
      time: req.body.time,
      userId: req.user.id,
      groupId: req.body.groupId,
    });
    res.status(201).json({
      res: "message sent successfully",
      id: newmsg.id,
      name: newmsg.name,
    });
  } catch (err) {
    res.status(500).json({ err, msg: "server error" });
  }
};

const chatGet = async (req, res, next) => {
  try {
    const getres = await Message.findAll({
      attribute: ["id", "name", "message", "time"],
      where: { groupId: req.params.globalGroupNumber },
      order: [["createdAt", "DESC"]],
      limit: 10,
    });
    const resArr = [];
    getres.forEach((el) => {
      const obj = {};
      obj.id = el.id;
      obj.name = el.name;
      obj.msg = el.message;
      obj.time = el.time;
      if (el.userId === req.user.id) {
        obj.self = true;
      } else {
        obj.self = false;
      }
      resArr.push(obj);
    });
    res.status(200).json(resArr);
  } catch (err) {
    console.log(err);
  }
};

const fatchMessage = async (req, res, next) => {
  try {
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
        name: getres[0].name,
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

var job = new CronJob(
  "57 11 * * *",
  async function () {
    console.log("cron job running");
    const yesterdaysChats = await sequelize.query("SELECT * FROM messages;", {
      type: Sequelize.QueryTypes.SELECT,
    });
    await ArchivedChat.bulkCreate(yesterdaysChats);
    await Message.destroy({
      where: {},
    });
  },
  null,
  true
);

module.exports = {
  chatPost,
  chatGet,
  fatchMessage,
  job,
};
