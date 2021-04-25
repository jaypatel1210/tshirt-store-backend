const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { signout, signup, signin, isSignedIn } = require('../controllers/auth');

router.post(
  '/signup',
  [
    check('name')
      .isLength({ min: 3 })
      .withMessage('name should be at least 3 char'),
    check('email').isEmail().withMessage('Email is required'),
    check('password')
      .isLength({ min: 6 })
      .withMessage('password should be at least 6 char'),
  ],
  signup
);

router.post(
  '/signin',
  [
    check('email').isEmail().withMessage('Email is required'),
    check('password').isLength({ min: 1 }).withMessage('password is required'),
  ],
  signin
);

/* router.get('/testroute', isSignedIn, (req, res) => {
  return res.json(req.auth);
}); */

router.get('/signout', signout);

module.exports = router;
