const router = require('express').Router();
const nodemailer = require('nodemailer');

router.post('/', (req, res) => {
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
            return console.log('Error occurs', err);
        }
        return console.log('Email sent!!!');
    });
    res.status(200).json({
        
    });
})


module.exports = router;

