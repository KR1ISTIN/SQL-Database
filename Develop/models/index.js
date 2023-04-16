// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category, { // joins these two tables together
  foreignKey: 'category_id' // belongsTo: one to one relation from child to parent with forgeinkey in childs table
});

// Categories have many Products
Category.hasMany(Product, { // Joins parent Category to Product child...
  foreignKey: 'category_id'// ..based on child's forgein key
});

// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {
  through: ProductTag,
  foreignKey: 'product_id'
});

// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product, {
  through: ProductTag,
  foreignKey: 'tag_id'
})

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
