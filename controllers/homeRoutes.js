// Contains all of the get routing logic to pull information from the database

const router = require('express').Router();
const withAuth = require('../utils/auth');
const { User, Category, Neighborhood, Tool } = require('../models');
const { Op } = require("sequelize");

// GET all categories for homepage
router.get('/', async (req, res) => {
  try {
    const dbCategoryData = await Category.findAll({});

        // Serialize all category data
    const categories = dbCategoryData.map((category) =>
    category.get({ plain: true })
    );
    console.log(req.session)
    res.render('homepage', {
      categories,
      logged_in: req.session.logged_in,
      neighborhood_name: req.session.neighborhood_name,
      user_name: req.session.user_name,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET one category
router.get('/category/:id', withAuth, async (req, res) => {
  try {
    const toolData = await Tool.findAll({
      where: {
        category_id: req.params.id,
      },
      include: [
        {
          model: User,
          attributes: ['name', 'neighborhood_id'],
          // where: {
          //   neighborhood_id: req.session.neighborhood_id,
          // }
        },
        {
          model: Category,
          attributes: ['name'],
        },
      ],
    }); 

    // Serialize all tool data
    const tools = await toolData.map((tool) =>
    tool.get({ plain: true })
    );  

    res.render('category', { 
      tools,
      logged_in: req.session.logged_in,
      neighborhood_name: req.session.neighborhood_name
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET one tool
// Use the custom middleware before allowing the user to access the tool
router.get('/tools/:id', withAuth, async (req, res) => {
  try {
    const dbToolData = await Tool.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name', 'id'],
        },
        {
          model: Category,
          attributes: ['name'],
        },
      ],
    });

    const tool = dbToolData.get({ plain: true });

    // Checks if the tool is the current logged in user's tool
    if(tool.user_id === req.session.user_id) {
      // Creates a new session parameter to flag for user's tool in handlebars
      req.session.user_tool = true;
    } else {
      req.session.user_tool = false;
    }

    res.render('tool', { 
      tool,
      user_tool: req.session.user_tool, 
      logged_in: req.session.logged_in,
      neighborhood_name: req.session.neighborhood_name
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET the login page
router.get('/login', (req, res) => {
  res.render('login');
});

// GET the update tool page
router.get('/update-tool/:id', async (req, res) => {
  const toolData = await Tool.findByPk(req.params.id, {
    include: [
      {
        model: User,
        attributes: ['name'],
      },
    ],
  });
  const tool = toolData.get ({ plain: true});
  
  // Render the update tool page and give access to tool, logged_in, and neighborhood_name
  res.render('update-tool', {
    tool,
    logged_in: req.session.logged_in,
    neighborhood_name: req.session.neighborhood_name,
  });
});

// GET the toolbox page
router.get('/toolbox', withAuth, async (req, res) => {
  try {
    // Find all tools from the logged in user
    // And include user's name from association of user model to post model
    const toolData = await Tool.findAll({
      where: {
        user_id: req.session.user_id,
      },
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Category,
          attributes: ['name'],
        },
      ],
    });

    // Serialize all tool data
    const tools = toolData.map((tool) => tool.get({ plain: true }));

    // Render the user's dashboard with tools and session parameters for template
    res.render('toolbox', { 
      tools, 
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
      neighborhood_name: req.session.neighborhood_name,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET the create a new tool page
router.get('/tools', withAuth, async (req, res) => {
  try {
    const toolData = await Tool.findAll({});

    // Serialize all tool data
    const tools = toolData.map((xxx) => xxx.get({ plain: true }));

    res.render('new-tool', { 
      tools, 
      logged_in: req.session.logged_in,
      neighborhood_name: req.session.neighborhood_name
    
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get searched tools
router.get('/:search', withAuth, async (req, res) => {
  try {
    const search = req.params.search;
    
    const toolData = await Tool.findAll({
      where: {
          [Op.or]: [
          {
            name: {
              [Op.substring]: '%' + search + '%'
            }
          },
          {
            description: {
              [Op.substring]: '%' + search + '%'
            }
          },
        ],
      },
      include: [
        {
          model: User,
          attributes: ['name', 'neighborhood_id'],
          include: [
            {
              model: Neighborhood,
              attributes: ['name'],
            },
          ],
        },
      ],
      order: [
        [User, Neighborhood, 'name', 'ASC'],
      ],
    });

    // Check if there are andny search results
    if(!toolData.length) {
      // Create new session parameter to flag for no search results
      req.session.no_results = true;
    } else {
      req.session.no_results = false;
    }

    // Serialize all tool data
    const tools = await toolData.map((tool) =>
    tool.get({ plain: true })
    );

    res.render('searchedtools', { 
      tools, 
      logged_in: req.session.logged_in, 
      neighborhood_name: req.session.neighborhood_name,
      no_results: req.session.no_results,
      search
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get one user's tools by id
router.get('/user/:id', withAuth, async (req, res) => {
  try {
    const toolData = await Tool.findAll({
      where: {
        user_id: req.params.id,
      },
      include: [
        {
          model: User,
          attributes: ['name', 'neighborhood_id'],
        },
        {
          model: Category,
          attributes: ['name'],
        },
      ],
    }); 

    // Serialize all tool data
    const tools = await toolData.map((tool) =>
    tool.get({ plain: true })
    );
    console.log(tools)

    res.render('user', { 
      tools, 
      logged_in: req.session.logged_in,
      neighborhood_name: req.session.neighborhood_name
     });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
