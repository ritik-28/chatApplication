// const userServices = require("../services/userServices");

const S3Service = require("../services/S3Services");
const Mediafiles = require("../model/mediafiles");
const Message = require("../model/chat");

const crypto = require("crypto");

const multimedia = async (req, res, next) => {
  try {
    const data = req.file.buffer;
    const groupId = req.body.groupId;
    const imageName = crypto.randomBytes(16).toString("hex");
    const imageNameWithextension = imageName + req.file.originalname;
    const fileUrl = await S3Service.uploadToS3(data, imageNameWithextension);

    await Mediafiles.create({
      groupId: groupId,
      url: fileUrl,
      filename: req.file.originalname,
    });
    const response = await Message.create({
      name: req.user.name,
      message: fileUrl,
      time: req.body.time,
      userId: req.user.id,
      groupId: groupId,
    });
    res.status(201).json({
      fileUrl,
      name: response.name,
      time: response.time,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ fileUrl: "", success: false });
  }
};

module.exports = multimedia;
