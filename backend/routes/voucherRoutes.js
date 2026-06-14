const router = require('express').Router();
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const c = require('../controllers/voucherController');

router.get('/', auth, c.listVouchers);
router.get('/:id', auth, c.getVoucher);
router.post('/', auth, requireAdmin, c.createVoucher);
router.put('/:id', auth, requireAdmin, c.updateVoucher);
router.delete('/:id', auth, requireAdmin, c.deleteVoucher);

module.exports = router;
