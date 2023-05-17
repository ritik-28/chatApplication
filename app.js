const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

const sequelize = require("./util/database");
const User = require("./model/user");
const Chat = require("./model/chat");
const Group = require("./model/group");
const UserGroups = require("./model/UserGroups");
const Forgotpassword = require("./model/ForgotPasswordRequests");

User.hasMany(Chat);
Chat.belongsTo(User);

Group.hasMany(Chat);
Chat.belongsTo(Group);

User.belongsToMany(Group, { through: "UserGroups" });
Group.belongsToMany(User, { through: "UserGroups" });

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

app.use(
  cors({
    origin: "http://127.0.0.1:8080",
    methods: ["GET", "POST"],
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("combined", { stream: accessLogStream }));

const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const groupRoutes = require("./routes/group");
const forgotpwdRoutes = require("./routes/forgot");

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/add", groupRoutes);
app.use("/password", forgotpwdRoutes);
app.use((req, res) => {
  console.log(req.url);
  res.sendFile(path.join(__dirname, `public/${req.url}`));
});

const port = process.env.PORT;

sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log("server is listening to port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
