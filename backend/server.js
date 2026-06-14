const express = require('express');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config();

const connectDB = require('./config/db');
const configurePassport = require('./config/passport');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 5000;

const seed = require('./seed/seed');

app.get('/api/seed', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const User = require('./models/User');
    const Category = require('./models/Category');
    const Voucher = require('./models/Voucher');

    const categories = await Category.insertMany([
      { name: 'Food' },
      { name: 'Travel' },
      { name: 'Shopping' },
      { name: 'Lifestyle' }
    ]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

connectDB();
configurePassport();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '2mb' }));
app.use(passport.initialize());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'carter-vouchers-api' });
});

app.get('/api/config', (req, res) => {
  res.json({
    googleOAuthEnabled: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
  });
});

const Category = require('./models/Category');
const Voucher = require('./models/Voucher');

app.get('/api/seed-test', async (req, res) => {
  try {
    await Category.create({ name: 'Food' });

    await Voucher.create({
      title: 'Test Voucher',
      description: 'Test Description',
      terms: 'Test Terms',
      image: 'https://via.placeholder.com/300',
      points: 100,
      limit: 10,
      expiryDate: new Date(Date.now() + 86400000)
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/vouchers', require('./routes/voucherRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/redeem', require('./routes/redeemRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
