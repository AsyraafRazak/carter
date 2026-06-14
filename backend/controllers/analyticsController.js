const CartItemHistory = require('../models/CartItemHistory');
const Voucher = require('../models/Voucher');

async function summary(req, res, next) {
  try {
    const redemptionStats = await CartItemHistory.aggregate([
      { $group: { _id: '$voucher', redemptions: { $sum: '$quantity' } } },
      { $sort: { redemptions: -1 } }
    ]);

    const vouchers = await Voucher.find().populate('category_id');
    const byId = new Map(redemptionStats.map(row => [String(row._id), row.redemptions]));
    const enriched = vouchers.map(voucher => ({
      id: voucher._id,
      title: voucher.title,
      category: voucher.category_id?.name,
      limit: voucher.limit,
      redeemedCount: byId.get(String(voucher._id)) || voucher.redeemedCount || 0,
      remaining: Math.max(voucher.limit - (byId.get(String(voucher._id)) || voucher.redeemedCount || 0), 0)
    }));

    const top = [...enriched].sort((a, b) => b.redeemedCount - a.redeemedCount).slice(0, 5);
    const low = [...enriched].sort((a, b) => a.redeemedCount - b.redeemedCount).slice(0, 5);

    const trends = await CartItemHistory.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          redemptions: { $sum: '$quantity' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ top, low, trends });
  } catch (err) {
    next(err);
  }
}

module.exports = { summary };
