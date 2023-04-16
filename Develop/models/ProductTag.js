const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');
const Product = require('./Product');
const Tag = require('./Tag');

class ProductTag extends Model {}

ProductTag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true,
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      references: { // Product table with the column "product_id"
        model: Product,
        key: 'product_id'
      }
    },
    tag_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Tag, // Tag table with column "tag_id"
        key: 'tag_id'
      }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product_tag',
  }
);

module.exports = ProductTag;
