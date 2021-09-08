const { validationResult } = require('express-validator');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      err: errors.array()[0].msg,
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        err,
      });
    }
    res.json({
      name: user.name,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      err: errors.array()[0].msg,
    });
  }

  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        err: 'User Email does not Exists',
      });
    }
    if (!user.authenticate(password)) {
      return res.status(401).json({
        err: 'Email and Password do not match',
      });
    }

    const token = jwt.sign({ _id: user._id }, 'jaypatelhere');
    res.cookie('token', token, { expire: new Date() + 99 });

    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie('token');
  res.json({
    message: 'User singout successfully',
  });
};

// protected route

exports.isSignedIn = expressJwt({
  secret: 'jaypatelhere',
  userProperty: 'auth',
});

// custom middleware

exports.isAuthenticated = (req, res, next) => {
  const checker = req.profile && req.auth && req.profile._id == req.auth._id;

  if (!checker)
    return res.status(403).json({
      err: 'Access Denied',
    });

  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0)
    return res.status(403).json({
      err: 'Access Denied, Not an Admin',
    });

  next();
};
