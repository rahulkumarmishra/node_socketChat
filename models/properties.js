const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('properties', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    property_type: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    latitude: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    longitude: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    area: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'properties',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
