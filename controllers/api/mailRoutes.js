const router = require('express').Router();
const nodemailer = require('nodemailer');
const { User, Tool } = require('../../models');

router.post('/:id', async (req, res) => {

    console.log(req.params.id)
    const dbToolData = await Tool.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: ['name', 'email'],
          },
        ],
      });
  
      const tool = dbToolData.get({ plain: true });
      console.log(tool.user.email)


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
        text: `Hey, ${tool.user.name}! ${req.session.user_name} has requested to borrow your ${tool.name}. testing that this is your email address: ${tool.user.email} and this is the logged in user's email address ${req.session.user_email} `
    };

    // Step 3
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            return console.log('Error occurs', err);
        }
        return console.log('Email sent!!!');
    });
    res.status(200).json({
        
    });
})


module.exports = router;

