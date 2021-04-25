const express = require('express');
const router = express.Router();
const {
  getOrderById,
  getAllOrder,
  getOrderStatus,
  createOrder,
  updateStatus,
} = require('../controllers/order');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getUserById, pushOrderInPurchaseList } = require('../controllers/user');
const { updateStock } = require('../controllers/product');

// params
router.param('userId', getUserById);
router.param('orderId', getOrderById);

// actual routes
router.post(
  '/order/create/:userId',
  isSignedIn,
  isAuthenticated,
  pushOrderInPurchaseList,
  updateStock,
  createOrder
);

router.get(
  '/order/all/:userId',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getAllOrder
);

router.get(
  '/order/status/:userId',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getOrderStatus
);

router.put(
  '/order/:orderId/status/:userId',
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateStatus
);

module.exports = router;
