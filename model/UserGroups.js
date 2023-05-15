const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const UserGroups = sequelize.define("UserGroups", {
  isAdmin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

module.exports = UserGroups;
