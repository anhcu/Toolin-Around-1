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

    // SERIALIZE ALL TOOL DATA
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

    // CHECK IF THE TOOL IS THE LOGGED IN USER'S TOOL
    if(tool.user_id === req.session.user_id) {
      // CREATE NEW SESSION PARAMETER TO FLAG FOR USER'S TOOL IN HANDLEBARS
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
    
    // CHECK IF THERE ARE ANY SEARCH RESULTS
    if(!toolData.length) {
      // CREATE NEW SESSION PARAMETER TO FLAG FOR NO SEARCH RESULTS
      req.session.no_results = true;
    } else {
      req.session.no_results = false;
    }

    // SERIALIZE ALL TOOL DATA
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

// GET ONE USER'S TOOLS BY ID
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

    // SERIALIZE ALL TOOL DATA
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
