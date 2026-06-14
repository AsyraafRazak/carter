const router = require('express').Router();
const auth = require('../middleware/auth');
const c = require('../controllers/cartController');

router.use(auth);
router.get('/', c.getCart);
router.post('/', c.addToCart);
router.put('/:id', c.updateQuantity);
router.delete('/:id', c.removeItem);
router.delete('/', c.clearCart);

module.exports = router;
