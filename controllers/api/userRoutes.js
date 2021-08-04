// Has all of the logic to login or sign up

const router = require('express').Router();
const { User, Neighborhood } = require('../../models');

// CREATE A NEW USER
router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);
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

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      req.session.neighborhood_id = userData.neighborhood_id;
      req.session.neighborhood_name = neighborhoodData.neighborhood.name;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// LOGIN A USER
router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({
      where: {
        email: req.body.email
      },
      include: [
        {
          model: Neighborhood,
          attributes: ['name'],
        },
      ],
    });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      req.session.neighborhood_id = userData.neighborhood_id;
      req.session.neighborhood_name = userData.neighborhood.name;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
