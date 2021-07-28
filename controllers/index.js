const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');

// Takes you to homeRoutes file
router.use('/', homeRoutes);

// Taks you to api folder, has index and userRoutes inside
router.use('/api', apiRoutes);

module.exports = router;
