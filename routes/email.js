const router = require('express').Router();

var nodemailer = require('nodemailer');
const fs = require('fs'); 

router.post('/email/send', (req, res) => {
    const { subject, sender, message } = req.body; 
    const credentials = JSON.parse(fs.readFileSync('credentials.json', 'utf8'));

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: credentials.smtp.usr,
            pass: credentials.smtp.ps
        }
    });
    
    var mailOptions = {
        from: 'barkow15@gmail.com',
        cc: sender,
        to: 'barkow15@gmail.com',
        subject: subject,
        text: message
    };
    
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            res.status(400).send({ response : 'There was an error sending the email. Please try again.' });
        } else {
            res.status(200).send({ response : 'Succesfully sent email.' });
        }
    });
});

module.exports = router;
