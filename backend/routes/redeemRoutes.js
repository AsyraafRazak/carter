const router = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/redeemController');

router.use(auth);
router.post('/cart', c.redeemCart);
router.post('/voucher/:voucherId', c.redeemSingleVoucher);
router.get('/history', c.history);
router.get('/orders/:orderId/pdf', c.orderPdf);

module.exports = router;
