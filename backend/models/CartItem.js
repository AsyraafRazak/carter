const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  voucher: { type: mongoose.Schema.Types.ObjectId, ref: 'Voucher', required: true },
  quantity: { type: Number, default: 1, min: 1 }
}, { timestamps: true });

cartItemSchema.index({ user: 1, voucher: 1 }, { unique: true });

module.exports = mongoose.model('CartItem', cartItemSchema);
