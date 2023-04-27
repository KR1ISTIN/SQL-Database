const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll({ 
      include: [{model: Category }, {model: Tag}] 
    })
    res.status(200).json(productData); // in json format combine the two tables
  } catch (err) { // if err, give err res
    res.status(500).json(err);
  }
  // find all products
  // be sure to include its associated Category and Tag data
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, { 
      include: [{model: Category}, {model: Tag} ]
    });
    if(!productData) { 
      res.status(404).json({message: "No product found with that id!"});
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err)
  }
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
    await Product.create({
    product_name: req.body.product_name, 
    price: req.body.price,
    stock: req.body.stock,
    category_id: req.body.category_id,
    tag_id: [req.body.tag_id]
  })
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tag_id.length) {
        const productTagIdArr = req.body.tag_id.map((tag_id) => {
          return {
            product_id: product.product_id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', async (req, res) => {
  // update product data
  await Product.update(
    {  // everything we can update
      product_name: req.body.product_name, 
      price: req.body.price,
      stock: req.body.stock,
      category_id: req.body.category_id,
      tag_id: [req.body.tag_id] 
    }, // the product_id which is equal to the params.id
    { where: { product_id: req.params.id } }
  ).then((product) => {
      console.log(product);
      // find all associated tags from ProductTag 
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id); //mapping through  an array of tag_id assosciated with product
      // create filtered list of new tag_ids
      const newProductTags = req.body.tag_id // what tag_id did we pass is params
        .filter((tag_id) => !productTagIds.includes(tag_id)) // filter tag_id and checking to see if its not included in array
        .map((tag_id) => {  // each tag 
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tag_id.includes(tag_id))
        .map(({ tag_id }) => tag_id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { product_id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  try {
    const deleteProd = await Product.destroy( 
      { where: {product_id: req.params.id} } 
      );
     
    if(!deleteProd) {
      res.status(404).json({message: 'No product with this ID found'});
      return;
    }
    res.status(200).json({message: 'Successfully deleted product'})
  } catch (err) {
    res.status(500).json(err)
  }
  // delete one product by its `id` value
});

module.exports = router;
