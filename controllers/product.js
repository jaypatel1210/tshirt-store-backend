const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate('category')
    .exec((err, product) => {
      if (err)
        return res.status(400).json({
          err: 'Product Not Found',
        });
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err)
      return res.status(400).json({
        err: 'Problem with Image',
      });

    const { name, description, price, category, stock } = fields;

    if (!name || !description || !price || !category || !stock)
      return res.status(400).json({
        err: 'Please Fill all Fields',
      });

    const product = new Product(fields);

    if (file.photo) {
      if (file.photo.size > 3000000)
        return res.status(400).json({ err: 'File size too big' });
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    product.save((err, product) => {
      if (err)
        return res.status(400).json({
          err: 'Saving Tshirt in DB Failed',
        });
      return res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set('Content-Type', req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.deleteProduct = (req, res) => {
  const product = req.product;

  product.remove((err, deletedProduct) => {
    if (err)
      return res.status(400).json({
        err: 'Deletion Failed',
      });
    return res.json({
      message: 'Product Deleted Successfully',
      deletedProduct,
    });
  });
};

exports.updateProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err)
      return res.status(400).json({
        err: 'Problem with Image',
      });

    const product = req.product;
    product = _.extend(product, fields);

    if (file.photo) {
      if (file.photo.size > 3000000)
        return res.status(400).json({ err: 'File size too big' });
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    product.save((err, product) => {
      if (err)
        return res.status(400).json({
          err: 'Updation of product Failed',
        });
      return res.json(product);
    });
  });
};

exports.getAllProducts = (req, res) => {
  const limit = req.query.limit ? req.query.limit : 8;
  const sortBy = req.query.sortBy ? req.query.sortBy : '_id';

  Product.find()
    .select('-photo')
    .populate('category')
    .sort([[sortBy, 'asc']])
    .limit(limit)
    .exec((err, products) => {
      if (err)
        return res.status(400).json({
          err: 'No Product Found',
        });
      return res.json(products);
    });
};

exports.getAllUniqueCategory = (req, res) => {
  Product.distinct('category', {}, (err, category) => {
    if (err)
      return res.status(400).json({
        err: 'No Category Found',
      });
    res.json(category);
  });
};

exports.updateStock = (req, res) => {
  const myOperation = req.body.order.products.map(prod => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  Product.bulkWrite(myOperation, {}, (err, products) => {
    if (err)
      return res.status(400).json({
        err: 'Failed to update stock',
      });
    next();
  });
};
