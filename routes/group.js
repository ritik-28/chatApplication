const express = require("express");

const router = express.Router();

const groupController = require("../controllers/group");
const authorization = require("../middleware/auth");

router.post("/creategroup", authorization, groupController.groupPost);
router.get("/getGroup", authorization, groupController.groupGet);
router.post("/groupmember", authorization, groupController.groupmemberPost);
// router.get("/fatchMessage", authorization, groupController.fatchMessage);

module.exports = router;
