const router = require('express').Router();
const { Category, Tool } = require('../models');
const withAuth = require('../utils/auth');
const { User, Category, Neighborhood, Tool } = require('../models');

// GET all categories for homepage
router.get('/', async (req, res) => {
  try {
    const dbCategoryData = await Category.findAll({
      include: [
        {
          model: Tool,
          attributes: ['name'],
        },
      ],
    });

    const categories = dbCategoryData.map((category) =>
    category.get({ plain: true })
    );

    res.render('homepage', {
      categories,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET one category
router.get('/category/:id', withAuth, async (req, res) => {
  try {
    const dbCategoryData = await Category.findByPk(req.params.id, {
      include: [
        {
          model: Tool,
          attributes: [
            'id',
            'name',
            'description',
          ],
        },
      ],
    });

    const category = dbCategoryData.get({ plain: true });
    res.render('category', { category, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET one tool
// Use the custom middleware before allowing the user to access the tool
router.get('/tool/:id', withAuth, async (req, res) => {
  try {
    const dbToolData = await Tool.findByPk(req.params.id);

    const Tool = dbToolData.get({ plain: true });

    res.render('Tool', { Tool, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});



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
