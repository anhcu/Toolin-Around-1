const router = require('express').Router();
const userRoutes = require('./userRoutes');
const toolRoutes = require('./toolRoutes');

router.use('/users', userRoutes);
router.use('/tools', toolRoutes);



module.exports = router;
