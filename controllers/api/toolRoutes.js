const router = require('express').Router();
const { Tool, User } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', async (req, res) => {
  try {
      const newTool = await Tool.create({
          name: req.body.name,
          description: req.body.description,
          user_id: req.session.user_id,
          category_id: req.body.category
      });

      console.log(newTool)
      
  res.status(200).json(newTool);
  } catch (err) {
      res.status(400).json(err);
  }
});

//delete route working 
router.delete('/:id', withAuth, async (req, res) => {
// alert("delete button was clicked");
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
        // catch will excute AFTER the try logic
        catch (err){
            res.status(500).json(err)
        }
});

// update route  
router.put('/:id', withAuth, async (req, res) => {
  try {
    const [toolData] = await Tool.update(req.body, {
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