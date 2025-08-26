const { Sequelize } = require("sequelize");

// Syntax: new Sequelize(database, username, password, { options })
const sequelize = new Sequelize("eventsdb", "root", "", {
  host: "localhost",
  port: 3307,
  dialect: "mysql",
});

module.exports = sequelize;