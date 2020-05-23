const router = require('express').Router();

const User = require('../models/User.js');

router.get('/users/roles', async (req, res) => {
    const users = await User.query().select('username').withGraphFetched('role');
    return res.send({ response: users });
});


router.get('/setsessionvalue', (req, res) => {
    req.session.myValue = ""; // take the value from the request and dynamically set it here
    return res.send({ });
});

router.get('/getsessionvalue', (req, res) => {
    return res.send({ response: req.session.myValue });
});

module.exports = router;