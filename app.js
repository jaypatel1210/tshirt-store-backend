require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// all routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const paymentRoutes = require('./routes/paymentB');

const app = express();

// DB Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('DB CONNECTED');
  })
  .catch(() => {
    console.log('ERROR IN CONNECTION');
  });

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', paymentRoutes);

// port
const port = process.env.PORT || 8000;

app.listen(port, () =>
  console.log(`App is Running on PORT http://localhost:${port}`)
);
