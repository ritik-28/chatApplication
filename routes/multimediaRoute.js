const express = require("express");
const multer = require("multer");

const router = express.Router();

const uploadController = require("../controllers/multimedia");
const authorization = require("../middleware/auth");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/fileupload",
  authorization,
  upload.single("file"),
  uploadController
);

module.exports = router;
