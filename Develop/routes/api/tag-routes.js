const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/',async (req, res) => {
  try {
    const tagData = await Tag.findAll({ 
      include: [{model: Product}] 
    })
    res.status(200).json(tagData); // in json format combine the two tables
  } catch (err) { // if err, give err res
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, { 
      include: [{model: Product}]
    });
    if(!tagData) { 
      res.status(404).json({message: "No tag found with that id!"});
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err)
  }
  // find a single tag by its `id`
  // be sure to include its associated Product data
});

router.post('/',async (req, res) => {
  try {
    const newTag = await Tag.create({
      tag_id: req.body.tag_id, 
      tag_name: req.body.tag_name 
    });
    res.status(200).json(newTag)
  } catch (err) {
    res.status(400).json(err)
  }
});

router.put('/:id', async(req, res) => {
  try {
    const updateTag = await Tag.update( // calling the Category table
      { tag_name: req.body.tag_name }, // calling column "category_name" and update with whatever is in the body req
      { where: {tag_id: req.params.id} } // where the column "category_id" is equal to the req.params.id
      );
    if(!updateTag) {
      res.status(404).json({message: 'No tag with this ID found'});
      return;
    }
    res.status(200).json(updateTag)
  } catch (err) {
    res.status(500).json(err)
  }
  // update a tag's name by its `id` value
});

router.delete('/:id', async (req, res) => {
  try {
    const deleteTag = await Tag.destroy( // call the Category table and remove
      { where: {tag_id: req.params.id} } // the "category_id" based on what is passed in the req.param.id
      );
     
    if(!deleteTag) {
      res.status(404).json({message: 'No tag with this ID found'});
      return;
    }
    res.status(200).json({message: 'Successfully deleted tag'})
  } catch (err) {
    res.status(500).json(err)
  }
  // delete on tag by its `id` value
});

module.exports = router;
