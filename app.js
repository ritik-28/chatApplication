const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const sequelize = require("./util/database");

const User = require("./model/user");
const Chat = require("./model/chat");
const Group = require("./model/group");

User.hasMany(Chat);
Chat.belongsTo(User);

Group.hasMany(Chat);
Chat.belongsTo(Group);

User.belongsToMany(Group, { through: "UserGroup" });
Group.belongsToMany(User, { through: "UserGroup" });

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

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/add", groupRoutes);

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log("server is listening to port 3000");
  });
});
