// Has all of the routing logic for creating, updating, or deleting a tool

const router = require('express').Router();
const { Tool, User } = require('../../models');
const withAuth = require('../../utils/auth');

// Route for creating a new tool
router.post('/', async (req, res) => {
  try {
      const newTool = await Tool.create({
          name: req.body.name,
          description: req.body.description,
          user_id: req.session.user_id,
          category_id: req.body.category
      });
      
  res.status(200).json(newTool);
  } catch (err) {
      res.status(400).json(err);
  }
});

// Route for deleting a tool
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const toolData = Tool.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

  if(toolData) {        
      res.status(200).end()
  } else{
      res.status(404).end()
  }}
  catch (err){
      res.status(500).json(err)
  }
});

// Route for updating a tool 
router.put('/:id', withAuth, async (req, res) => {
  try {
    const toolData = await Tool.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (toolData){
      res.status(200).end();
    } else {
      res.status(404).end();
    }
  }catch (err) {
    res.status(500).json(err)
  }
});

module.exports = router;