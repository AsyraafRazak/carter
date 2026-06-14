const CartItem = require('../models/CartItem');

async function getCart(req, res, next) {
  try {
    const items = await CartItem.find({ user: req.userId }).populate({
      path: 'voucher',
      populate: { path: 'category_id' }
    }).sort('-updatedAt');

    const totalPoints = items.reduce((sum, item) => sum + item.voucher.points * item.quantity, 0);
    res.json({ items, totalPoints });
  } catch (err) {
    next(err);
  }
}

async function addToCart(req, res, next) {
  try {
    const { voucher, quantity = 1 } = req.body;
    if (!voucher || quantity < 1) {
      return res.status(400).json({ message: 'Voucher and valid quantity are required.' });
    }

    const item = await CartItem.findOneAndUpdate(
      { user: req.userId, voucher },
      {
        $setOnInsert: { user: req.userId, voucher },
        $inc: { quantity: Number(quantity) }
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).populate('voucher');

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

async function updateQuantity(req, res, next) {
  try {
    const quantity = Number(req.body.quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1.' });
    }

    const item = await CartItem.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { quantity },
      { new: true, runValidators: true }
    ).populate('voucher');

    if (!item) return res.status(404).json({ message: 'Cart item not found.' });
    res.json(item);
  } catch (err) {
    next(err);
  }
}

async function removeItem(req, res, next) {
  try {
    const item = await CartItem.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!item) return res.status(404).json({ message: 'Cart item not found.' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

async function clearCart(req, res, next) {
  try {
    await CartItem.deleteMany({ user: req.userId });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addToCart, updateQuantity, removeItem, clearCart };
