const router = require('express').Router();
const withAuth = require('../utils/auth');
const { User, Category, Neighborhood, Tool } = require('../models');
const { Op } = require("sequelize");

// GET all categories for homepage
router.get('/', async (req, res) => {
  try {
    const dbCategoryData = await Category.findAll({});

    const categories = dbCategoryData.map((category) =>
    category.get({ plain: true })
    );
    console.log(req.session)
    res.render('homepage', {
      categories,
      logged_in: req.session.logged_in,
      neighborhood_name: req.session.neighborhood_name,
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
      ],
    }); 

    // SERIALIZE ALL TOOL DATA
    const tools = await toolData.map((tool) =>
    tool.get({ plain: true })
    );
    console.log(tools)

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
          attributes: ['name'],
        },
      ],
    });

    const tool = dbToolData.get({ plain: true });

    res.render('tool', { 
      tool, 
      logged_in: req.session.logged_in,
      neighborhood_name: req.session.neighborhood_name
     });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

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
  
  res.render('update-tool', {
    tool,
    logged_in: req.session.logged_in,
    neighborhood_name: req.session.neighborhood_name,
  });
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
        {
          model: Category,
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
      neighborhood_name: req.session.neighborhood_name,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.get('/thetool', async(req, res)=>{
//   try{
//     const theData = await Tool.findAll();
//     const theInfo = theData.map((tool)=> tool.get({plain: true}));
//   res.render('tool', {theData})
//   res.json(theData)
//   }
//   catch(err){
//     res.status(500).json(err)
//   }
// });

router.get('/tools', withAuth, async (req, res) => {
  try {
    const toolData = await Tool.findAll({
    });
    
    const tools = toolData.map((xxx) => xxx.get({ plain: true }));
    //const categories = categoryData.get({ plain: true });

    res.render('new-tool', { 
      tools, 
      logged_in: req.session.logged_in,
      neighborhood_name: req.session.neighborhood_name
    
    });
  } catch (err) {
    res.status(500).json(err);
  }

});

// GET SEARCHED TOOLS
router.get('/:search', withAuth, async (req, res) => {
  try {
    console.log(req.body.search)
    const search = req.params.search;
    console.log(search)
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
          // where: {
          //   neighborhood_id: req.session.neighborhood_id,
          // }
        },
      ],
    }); 

    // SERIALIZE ALL TOOL DATA
    const tools = await toolData.map((tool) =>
    tool.get({ plain: true })
    );
    console.log(tools)

    res.render('searchedtools', { 
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
