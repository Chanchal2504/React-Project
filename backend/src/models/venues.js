const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");


const Venue = sequelize.define(
  "Venue",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    capacity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    contact: { type: DataTypes.STRING, allowNull: false }, // added contact field
    availability: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    image: { type: DataTypes.STRING, allowNull: true },
    organizerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    breakfastPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    lunchPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    mealPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    tableName: "venues",
    timestamps: true,
  }
);


module.exports = Venue;
