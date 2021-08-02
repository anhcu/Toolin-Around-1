const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');

require('dotenv').config();

const nodemailer = require('nodemailer');
const log = console.log;



// Step 1
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.EMAIL,// || //'abc@gmail.com', // TODO: your gmail account
      pass: process.env.PASSWORD //|| '1234' // TODO: your gmail password
  }
});

// Step 2
let mailOptions = {
  from: 'toolin.around21@gmail.com', // TODO: email sender
  to: 'toolin.around21@gmail.com', // TODO: email receiver
  subject: 'Nodemailer - Test',
  text: 'Wooohooo'
};

// Step 3
transporter.sendMail(mailOptions, (err, data) => {
  if (err) {
      return log('Error occurs', err);
  }
  return log('Email sent!!!');
});


const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

// Inform Express.js on which template engine to use
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});
