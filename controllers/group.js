const Group = require("../model/group");
const User = require("../model/user");
const Messages = require("../model/chat");
const UserGroup = require("../model/UserGroups");
const sequelize = require("../util/database");
const { Op } = require("sequelize");

const groupPost = async (req, res, next) => {
  try {
    const { id, name } = req.user;
    const { groupname } = req.body;
    const group = await Group.create({
      name: groupname,
      createdby: name,
      createdbyId: id,
    });
    const user = await UserGroup.create({
      isAdmin: true,
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
    const groupsAll = await UserGroup.findAll({
      where: { userId: req.user.id },
    });
    if (groupsAll) {
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
    } else {
      res.json("no group found");
    }
  } catch (err) {
    res.status(500).json("internal server error");
  }
};

const groupmemberPost = async (req, res, next) => {
  try {
    console.log("running");
    const memberOrNot = await User.findOne({
      where: { email: req.body.member },
    });
    if (memberOrNot) {
      const user = await UserGroup.create({
        isAdmin: false,
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

const removeMember = async (req, res, next) => {
  try {
    const memberOrNot = await User.findOne({
      where: { email: req.body.member },
    });
    if (memberOrNot) {
      const userdeleted = await UserGroup.destroy({
        where: {
          [Op.and]: {
            userId: memberOrNot.id,
            groupId: req.body.groupId,
          },
        },
      });
      const associatedMsgDeleted = await Messages.destroy({
        where: {
          [Op.and]: {
            userId: memberOrNot.id,
            groupId: req.body.groupId,
          },
        },
      });
      res.status(201).json("member is removed");
    } else {
      res.status(404).json("this user is not on Tiwachat app");
    }
  } catch (err) {
    console.log(err);
  }
};

const makeAdmin = async (req, res, next) => {
  try {
    const member = await User.findOne({
      where: {
        email: req.body.member,
      },
    });
    if (member) {
      await UserGroup.update(
        {
          isAdmin: true,
        },
        {
          where: {
            [Op.and]: {
              userId: member.id,
              groupId: req.body.groupId,
            },
          },
        }
      );
      res.status(200).json("this user is now a admin");
    } else {
      res.json("user not on this app");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const admin = async (req, res, next) => {
  try {
    const isAdmin = await UserGroup.findOne({
      where: {
        [Op.and]: {
          userId: req.user.id,
          groupId: req.params.globalGroupNumber,
        },
      },
    });
    if (isAdmin.isAdmin) {
      res.status(200).json({ msg: "user is admin" });
    } else {
      res.json({ msg: "user is not admin" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteGroup = async (req, res, next) => {
  const groupId = req.params.globalGroupNumber;
  await Messages.destroy({
    where: {
      groupId: groupId,
    },
    force: true,
  }),
    Promise.all([
      await Group.destroy({
        where: { id: groupId },
      }),
      await UserGroup.destroy({
        where: { groupId: groupId },
      }),
    ]);
};

const getname = async (req, res, next) => {
  try {
    const userName = await User.findOne({
      where: {
        id: req.user.id,
      },
    });
    res.status(200).json(userName.name);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  groupPost,
  groupGet,
  groupmemberPost,
  admin,
  removeMember,
  makeAdmin,
  deleteGroup,
  getname,
};
