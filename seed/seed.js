// Logic to create seed and assign random tools and neighborhoods to user

const sequelize = require('../config/connection');

const { User, Tool, Category, Neighborhood } = require('../models');

const userData = require('./userData.json');
const toolData = require('./toolData.json');
const categoryData = require('./categoryData.json');
const neighborhoodData = require('./neighborhoodData.json')

const seedDatabase = async () => {
  await sequelize.sync({ force: true });
  console.log('\n----- DATABASE SYNCED -----\n');

  const neighborhoods = await Neighborhood.bulkCreate(neighborhoodData);
  console.log('\n----- NEIGHBORHOODS SEEDED -----\n');

  await Category.bulkCreate(categoryData);
  console.log('\n----- CATEGORIES SEEDED -----\n');

  for (const user of userData) {
    await User.create({
      ...user,
      neighborhood_id: neighborhoods[Math.floor(Math.random() * neighborhoods.length)].id,
    }, {
      individualHooks: true,
      returning: true,
    });
  }
  console.log('\n----- USERS SEEDED -----\n');

  const users = await User.findAll();

  for (const tool of toolData) {
    await Tool.create({
      ...tool,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    });
  }
  console.log('\n----- TOOLS SEEDED -----\n');

  process.exit(0);
};

seedDatabase();