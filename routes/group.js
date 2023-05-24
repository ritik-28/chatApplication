const express = require("express");

const router = express.Router();

const groupController = require("../controllers/group");
const authorization = require("../middleware/auth");

router.post("/creategroup", authorization, groupController.groupPost);
router.get("/getGroup", authorization, groupController.groupGet);
router.post("/groupmember", authorization, groupController.groupmemberPost);
router.get("/admin/:globalGroupNumber", authorization, groupController.admin);
router.post("/removemember", authorization, groupController.removeMember);
router.post("/makeadmin", authorization, groupController.makeAdmin);
router.get(
  "/deleteGroup/:globalGroupNumber",
  authorization,
  groupController.deleteGroup
);
router.get("/getname", authorization, groupController.getname);

module.exports = router;
