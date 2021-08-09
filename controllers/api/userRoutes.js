// Has all of the routing logic to login or sign up

// BRING IN EXPRESS ROUTER AND USER & NEIGHBORHOOD MODELS
const router = require('express').Router();
const { User, Neighborhood } = require('../../models');

// CREATES A NEW USER
router.post('/', async (req, res) => {
  try {
    // CREATE A NEW USER IN THE DB WITH THE FORM DATA
    const userData = await User.create(req.body);

    // GET THE NEW USER'S NEIGHBORHOOD NAME FOR NAV BAR RENDERING
    const neighborhoodData = await User.findOne({
      where: {
        email: userData.email
      },
      include: [
        {
          model: Neighborhood,
          attributes: ['name'],
        },
      ],
    });

    // VARIABLES TO SAVE TO SESSION FOR HANDLEBARS INPUTS AND CONDITIONALS
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      req.session.neighborhood_id = userData.neighborhood_id;
      req.session.neighborhood_name = neighborhoodData.neighborhood.name;
      req.session.user_email = userData.email;
      req.session.user_name = userData.name;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// LOGS IN A USER
router.post('/login', async (req, res) => {
  try {
    // FIND A USER IN THE DB WITH THE MATCHING EMAIL
    const userData = await User.findOne({
      where: {
        email: req.body.email
      },
      // INCLUDE THEIR NEIGHBORHOOD NAME FOR NAV BAR RENDERING
      include: [
        {
          model: Neighborhood,
          attributes: ['name'],
        },
      ],
    });

    // IF NO USER EXISTS IN DB, THROW 400 ERROR
    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    // USE INSTANCE METHOD TO CHECK THE SUBMITTED PASSWORD AGAINST THE DB
    const validPassword = await userData.checkPassword(req.body.password);

    // IF PASSWORD DOESN'T MATCH, THROW 400 ERROR
    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    // VARIABLES TO SAVE TO SESSION FOR HANDLEBARS INPUTS AND CONDITIONALS
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      req.session.neighborhood_id = userData.neighborhood_id;
      req.session.neighborhood_name = userData.neighborhood.name;
      req.session.user_email = userData.email;
      req.session.user_name = userData.name;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

// LOGS OUT A USER
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// EXPORT ROUTER
module.exports = router;
