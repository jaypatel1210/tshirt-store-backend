const Category = require('../models/category');

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err)
      return res.status(400).json({
        err: 'No Category Found',
      });
    req.category = cate;
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);

  category.save((err, category) => {
    if (err)
      return res.status(400).json({
        err: 'Not able to create category',
      });
    res.json(category);
    // res.json({category});
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err)
      return res.status(400).json({
        err: 'No Categories Found',
      });
    res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;

  category.save((err, updatedCategory) => {
    if (err)
      return res.status(400).json({
        err,
      });
    return res.json(updatedCategory);
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;

  category.remove((err, category) => {
    if (err)
      return res.status(400).json({
        err: 'Failed to delete Category',
      });
    return res.json({
      message: `Successfully deleted ${category.name}`,
    });
  });
};
