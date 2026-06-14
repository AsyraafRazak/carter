const router = require('express').Router();
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const c = require('../controllers/categoryController');

router.get('/', auth, c.listCategories);
router.post('/', auth, requireAdmin, c.createCategory);
router.put('/:id', auth, requireAdmin, c.updateCategory);
router.delete('/:id', auth, requireAdmin, c.deleteCategory);

module.exports = router;
