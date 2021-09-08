const User = require('../models/user');
const Order = require('../models/order');

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        err: 'No user found in DB',
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.updatedAt = undefined;
  user.createdAt = undefined;

  return res.json(req.profile);
};

/* exports.getAllUser = (req, res) => {
  User.find().exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        err: 'No users found',
      });
    }
    res.json(user);
  });
}; */

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          err: 'You are not authorized to update data',
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      user.updatedAt = undefined;
      user.createdAt = undefined;
      res.json(user);
    }
  );
};

exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate('user', '_id name')
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          err: 'No order found',
        });
      }
      return res.json(order);
    });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchasesList = [];
  req.body.order.products.forEach(product => {
    purchasesList.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });

  console.log(`PURCHASE LIST => ${JSON.stringify(purchasesList)}`);

  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchasesList } },
    { new: true, useFindAndModify: false },
    (err, purchases) => {
      console.log(purchases);
      console.log(`FIND ONE AND UPDATE ERR => ${err}`);
      if (err) {
        return res.status(400).json({
          err: 'Unable to save purchase list',
        });
      }
      next();
    }
  );
};
