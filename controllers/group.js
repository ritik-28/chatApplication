const Group = require("../model/group");
const User = require("../model/user");
const sequelize = require("../util/database");
const { Op, DATEONLY } = require("sequelize");

const groupPost = async (req, res, next) => {
  try {
    const { id, name } = req.user;
    const { groupname } = req.body;
    const group = await Group.create({
      name: groupname,
      createdby: name,
      createdbyId: id,
    });
    const user = await sequelize.models.UserGroup.create({
      userId: id,
      groupId: group.id,
    });
    res.status(200).json({ msg: "group is created", groupId: group.id });
  } catch (err) {
    res.status(500).json(err);
  }
};

const groupGet = async (req, res, next) => {
  try {
    const groupsAll = await sequelize.models.UserGroup.findAll({
      where: { userId: req.user.id },
    });
    const groupIds = [];
    groupsAll.forEach((el) => {
      groupIds.push(`${el.groupId}`);
    });
    const groups = await Group.findAll({
      where: {
        id: {
          [Op.in]: [...groupIds],
        },
      },
      order: [["createdAt", "ASC"]],
    });
    res.status(200).json({ msg: "groups fetched", groups });
  } catch (err) {
    res.status(500).json(err);
  }
};

const groupmemberPost = async (req, res, next) => {
  try {
    const memberOrNot = await User.findOne({
      where: { email: req.body.member },
    });
    if (memberOrNot !== null) {
      const user = await sequelize.models.UserGroup.create({
        userId: memberOrNot.id,
        groupId: req.body.groupId,
      });
      res.status(201).json("new member created");
    } else {
      res.status(404).json("this user is not on Tiwachat app");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  groupPost,
  groupGet,
  groupmemberPost,
};
