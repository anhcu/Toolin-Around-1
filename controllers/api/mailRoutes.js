const router = require('express').Router();
const nodemailer = require('nodemailer');
const { User, Tool } = require('../../models');

// Route to send out email after "Request to Borow is clicked"
// This is the functionality for nodemailer
router.post('/:id', async (req, res) => {

    // Find tool by pk and inslude user names and emails
    const dbToolData = await Tool.findByPk(req.params.id, {
        include: [
            {
            model: User,
            attributes: ['name', 'email'],
            },
        ],
    });

    const tool = dbToolData.get({ plain: true });

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
        from: 'toolin.around21@gmail.com', // TODO: email sender, req.session.user_email
        to: 'toolin.around21@gmail.com', // TODO: email receiver, tool.user.email
        subject: 'Tool Requested',
        text: 'A neighbor has requested one of your tools.',
        html: `
            <p>Hey, ${tool.user.name}! The user below has requested to borrow one of your tools. Please contact them directly to arrange for pick up.</p>
            <ul>
                <li>Name: ${req.session.user_name}</li>
                <li>Email: ${req.session.user_email}</li>
                <li>Tool Requested:${tool.name}</li>
            </ul>
        `
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

