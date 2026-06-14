const router = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/redeemController');

// Protected routes
router.post('/cart', auth, c.redeemCart);
router.post('/voucher/:voucherId', auth, c.redeemSingleVoucher);
router.get('/history', auth, c.history);

// PDF download route (public for direct browser download)
router.get('/orders/:orderId/pdf', c.orderPdf);

module.exports = router;