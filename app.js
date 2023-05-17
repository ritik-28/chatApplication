const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

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
    origin: "*",
    methods: ["GET", "POST"],
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const userRoutes = require("./routes/user");
const chatRoutes = require("./routes/chat");
const groupRoutes = require("./routes/group");
const forgotpwdRoutes = require("./routes/forgot");

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/add", groupRoutes);
app.use("/password", forgotpwdRoutes);

const port = process.env.PORT;

sequelize
  .sync({ force: true })
  .then(() => {
    app.listen(port, () => {
      console.log("server is listening to port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
