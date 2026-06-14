const mongoose = require('mongoose');
const QRCode = require('qrcode');
const { randomUUID } = require('crypto');
const CartItem = require('../models/CartItem');
const CartItemHistory = require('../models/CartItemHistory');
const Voucher = require('../models/Voucher');
const { createCouponCode } = require('../utils/coupon');
const { writeVoucherPdf } = require('../utils/voucherPdf');

async function buildHistoryRows({ userId, items, orderId }) {
  const rows = [];

  for (const item of items) {
    for (let i = 0; i < item.quantity; i += 1) {
      const couponCode = createCouponCode();
      const qrCode = await QRCode.toDataURL(couponCode);
      rows.push({
        orderId,
        user: userId,
        voucher: item.voucher._id,
        quantity: 1,
        couponCode,
        qrCode,
        timestamp: new Date()
      });
    }
  }

  return rows;
}

function validateVoucher(voucher, quantity) {
  if (!voucher || !voucher.isActive) return 'Voucher is not active.';
  if (new Date(voucher.expiryDate) < new Date()) return 'Voucher is expired.';
  if (voucher.redeemedCount + quantity > voucher.limit) return 'Voucher redemption limit reached.';
  return null;
}

async function redeemCartWork(req, session) {
  const query = CartItem.find({ user: req.userId }).populate('voucher');
  const items = session ? await query.session(session) : await query;

  if (!items.length) {
    const err = new Error('Cart is empty.');
    err.statusCode = 400;
    throw err;
  }

  for (const item of items) {
    const message = validateVoucher(item.voucher, item.quantity);
    if (message) {
      const err = new Error(message);
      err.statusCode = 400;
      throw err;
    }
  }

  const totalPoints = items.reduce((sum, item) => sum + item.voucher.points * item.quantity, 0);
  if (req.user.points < totalPoints) {
    const err = new Error('Not enough points.');
    err.statusCode = 400;
    throw err;
  }

  const orderId = `ORD-${randomUUID().slice(0, 8).toUpperCase()}`;
  const rows = await buildHistoryRows({ userId: req.userId, items, orderId });
  await CartItemHistory.insertMany(rows, session ? { session } : undefined);

  for (const item of items) {
    await Voucher.updateOne(
      { _id: item.voucher._id },
      { $inc: { redeemedCount: item.quantity } },
      session ? { session } : undefined
    );
  }

  req.user.points -= totalPoints;
  await req.user.save(session ? { session } : undefined);
  const deleteQuery = CartItem.deleteMany({ user: req.userId });
  if (session) await deleteQuery.session(session);
  else await deleteQuery;

  return {
    message: 'Redeemed successfully.',
    orderId,
    totalPoints,
    remainingPoints: req.user.points,
    pdfUrl: `/api/redeem/orders/${orderId}/pdf`
  };
}

async function redeemCart(req, res, next) {
  let session;
  try {
    session = await mongoose.startSession();
    let responsePayload;
    await session.withTransaction(async () => {
      responsePayload = await redeemCartWork(req, session);
    });
    res.json(responsePayload);
  } catch (err) {
    const transactionUnsupported = /Transaction numbers|replica set|standalone/i.test(err.message);
    if (!transactionUnsupported) {
      return next(err);
    }

    try {
      const responsePayload = await redeemCartWork(req, null);
      res.json(responsePayload);
    } catch (fallbackErr) {
      next(fallbackErr);
    }
  } finally {
    if (session) session.endSession();
  }
}

async function redeemSingleVoucher(req, res, next) {
  try {
    const quantity = Math.max(Number(req.body.quantity || 1), 1);
    const voucher = await Voucher.findById(req.params.voucherId);
    if (!voucher) return res.status(404).json({ message: 'Voucher not found.' });

    const message = validateVoucher(voucher, quantity);
    if (message) return res.status(400).json({ message });

    const totalPoints = voucher.points * quantity;
    if (req.user.points < totalPoints) {
      return res.status(400).json({ message: 'Not enough points.' });
    }

    const orderId = `ORD-${randomUUID().slice(0, 8).toUpperCase()}`;
    const rows = await buildHistoryRows({
      userId: req.userId,
      orderId,
      items: [{ voucher, quantity }]
    });

    await CartItemHistory.insertMany(rows);
    await Voucher.updateOne({ _id: voucher._id }, { $inc: { redeemedCount: quantity } });
    req.user.points -= totalPoints;
    await req.user.save();

    res.json({
      message: 'Redeemed successfully.',
      orderId,
      totalPoints,
      remainingPoints: req.user.points,
      pdfUrl: `/api/redeem/orders/${orderId}/pdf`
    });
  } catch (err) {
    next(err);
  }
}

async function history(req, res, next) {
  try {
    const rows = await CartItemHistory.find({ user: req.userId })
      .populate('voucher')
      .sort('-timestamp');
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function orderPdf(req, res, next) {
  try {
    const items = await CartItemHistory.find({
      orderId: req.params.orderId
    })
      .populate('voucher')
      .populate('user')
      .sort('timestamp');

    if (!items.length) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    writeVoucherPdf({
      user: items[0].user,
      orderId: req.params.orderId,
      items,
      res
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { redeemCart, redeemSingleVoucher, history, orderPdf };
