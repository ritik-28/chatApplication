const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./util/database");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const userRoutes = require("./routes/user");

app.use("/user", userRoutes);

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log("server is listening to port 3000");
  });
});
