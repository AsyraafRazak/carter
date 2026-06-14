const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Voucher = require('../models/Voucher');
const CartItem = require('../models/CartItem');
const CartItemHistory = require('../models/CartItemHistory');

dotenv.config();

async function seed() {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Voucher.deleteMany({}),
    CartItem.deleteMany({}),
    CartItemHistory.deleteMany({})
  ]);

  const password = await bcrypt.hash('password123', 10);
  await User.create([
    { email: 'user@carter.test', username: 'aisha', password, points: 1500, role: 'user' },
    { email: 'admin@carter.test', username: 'admin', password, points: 5000, role: 'admin' }
  ]);

  const categories = await Category.insertMany([
    { name: 'Food' },
    { name: 'Travel' },
    { name: 'Shopping' },
    { name: 'Lifestyle' }
  ]);

  const byName = Object.fromEntries(categories.map(category => [category.name, category._id]));
  const future = new Date();
  future.setMonth(future.getMonth() + 3);

  await Voucher.insertMany([
    {
      title: 'RM20 Coffee Treat',
      description: 'Enjoy coffee and pastries at selected partner cafes.',
      terms: 'Valid once per customer at participating outlets.',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
      points: 180,
      category_id: byName.Food,
      limit: 80,
      expiryDate: future
    },
    {
      title: 'Airport Lounge Access',
      description: 'Relax before your flight with one-time lounge access.',
      terms: 'Subject to availability. Booking required.',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05',
      points: 700,
      category_id: byName.Travel,
      limit: 30,
      expiryDate: future
    },
    {
      title: '15% Mall Weekend Voucher',
      description: 'Save on fashion, tech, and home essentials.',
      terms: 'Valid on weekends only. Maximum discount RM60.',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
      points: 350,
      category_id: byName.Shopping,
      limit: 100,
      expiryDate: future
    },
    {
      title: 'Fitness Class Pass',
      description: 'Try a yoga, spinning, or HIIT class with a partner studio.',
      terms: 'Advance booking required.',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a',
      points: 260,
      category_id: byName.Lifestyle,
      limit: 70,
      expiryDate: future
    },
    {
      title: 'Family Dinner Deal',
      description: 'Redeem a dinner voucher at selected family restaurants.',
      terms: 'Not valid with other promotions.',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0',
      points: 520,
      category_id: byName.Food,
      limit: 45,
      expiryDate: future
    }
  ]);

  console.log('Seed complete');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
