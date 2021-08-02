const router = require('express').Router();
const withAuth = require('../utils/auth');
const { User, Category, Neighborhood, Tool } = require('../models');

router.get('/', async (req, res) => {
  res.render('homepage');
});

router.get('/pageone', async (req, res) => {
  res.render('pageone');
});

router.get('/login', async (req, res) => {
  res.render('login');
});

router.get('/toolbox', withAuth, async (req, res) => {
  try {
    // FIND ALL TOOLS FROM THE LOGGED IN USER
    // AND INCLUDE USER'S NAME FROM ASSOCIATION OF USER MODEL TO POST MODEL
    const toolData = await Tool.findAll({
      where: {
        user_id: req.session.user_id,
      },
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    // SERIALIZE TOOL DATA SO TEMPLATE CAN READ IT
    const tools = toolData.map((tool) => tool.get({ plain: true }));

    // RENDER THE USER'S DASHBOARD WITH TOOLS & SESSION PARAMETERS FOR TEMPLATE
    res.render('toolbox', { 
      tools, 
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});




module.exports = router;
