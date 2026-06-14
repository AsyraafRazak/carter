const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  points: { type: Number, required: true, min: 0 },
  title: { type: String, required: true, trim: true },
  image: { type: String },
  description: { type: String },
  terms: { type: String },
  limit: { type: Number, default: 100, min: 1 },
  redeemedCount: { type: Number, default: 0, min: 0 },
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

voucherSchema.virtual('remaining').get(function remaining() {
  return Math.max(this.limit - this.redeemedCount, 0);
});

voucherSchema.set('toJSON', { virtuals: true });
voucherSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Voucher', voucherSchema);
