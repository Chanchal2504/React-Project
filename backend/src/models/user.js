const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM("organizer", "attendee"),
    allowNull: false,
    defaultValue: "attendee",
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: "users",   // 👈 match your manual table name
  timestamps: false     // disable auto createdAt/updatedAt
});

module.exports = User;
