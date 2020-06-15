const middleware = require('../middleware/middleware.js');
const router = require('express').Router()

const User = require('../models/User.js');

/* Setup fs */
const fs = require('fs'); 

// load header and footer html templates
const header = fs.readFileSync("public/header/header.html", "utf8");
const footer = fs.readFileSync("public/footer/footer.html", "utf8");

router.get('/user/dashboard', middleware.loggedin, async (req, res) => {
/*     const users = await User.query().select('username').withGraphFetched('role');
    return res.send({ response: users }); */
    const login = fs.readFileSync("public/user/dashboard/dashboard.html");
    

    return res.status(200).send(header + login + footer);
});

module.exports = router;