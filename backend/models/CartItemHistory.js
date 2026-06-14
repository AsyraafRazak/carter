const mongoose = require('mongoose');

const cartItemHistorySchema = new mongoose.Schema({
  orderId: { type: String, required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  voucher: { type: mongoose.Schema.Types.ObjectId, ref: 'Voucher', required: true },
  quantity: { type: Number, required: true, min: 1 },
  couponCode: { type: String, required: true, unique: true },
  qrCode: { type: String },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('CartItemHistory', cartItemHistorySchema);
