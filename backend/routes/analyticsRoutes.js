const router = require('express').Router();
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const c = require('../controllers/analyticsController');

router.get('/summary', auth, requireAdmin, c.summary);

module.exports = router;
