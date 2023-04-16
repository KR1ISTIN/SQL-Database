const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll({ // SELECT * FROM category AND product ...
      include: [{model: Product}] // ... WHERE Product.category_id = Category.catagory_id;
    })
    res.status(200).json(categoryData); // in json format combine the two tables, needs to be a json res bc client and server relations
  } catch (err) { // if err, give err res
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const catagoryData = await Category.findByPk(req.params.id, { 
     // findByPK is searching for the category_id since its the primary key 
      include: [{model: Product}]
      // includes all products associated with that primary key bc Products contains a forgein key, under category_id in the Product table
    });
    if(!catagoryData) { // if there is not ID under category then return json message
      res.status(404).json({message: "No category found with that id!"});
      return;
    }
    res.status(200).json(catagoryData);
  } catch (err) {
    res.status(500).json(err)
  }
});

//creates new category
router.post('/', async(req, res) => {
  try {
    const newCat = await Category.create({
      category_id: req.body.category_id, //
      category_name: req.body.category_name //
    });
    res.status(200).json(newCat)
  } catch (err) {
    res.status(400).json(err)
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updateCat = await Category.update( // calling the Category table
      { category_name: req.body.category_name }, // calling column "category_name" and update with whatever is in the body req
      { where: {category_id: req.params.id} } // where the column "category_id" is equal to the req.params.id
      );
    if(!updateCat) {
      res.status(404).json({message: 'No category with this ID found'});
      return;
    }
    res.status(200).json(updateCat)
  } catch (err) {
    res.status(500).json(err)
  }
  // update a category by its `id` value
});

router.delete('/:id',async (req, res) => {
  try {
    const deleteCat = await Category.destroy( // call the Category table and remove
      { where: {category_id: req.params.id} } // the "category_id" based on what is passed in the req.param.id
      );
     
    if(!deleteCat) {
      res.status(404).json({message: 'No category with this ID found'});
      return;
    }
    res.status(200).json({message: 'Successfully deleted category'})
  } catch (err) {
    res.status(500).json(err)
  }
  // delete a category by its `id` value
});

module.exports = router;
