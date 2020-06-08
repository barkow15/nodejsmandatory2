const express = require('express');
const app = express();
const bodyParser = require("body-parser");

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Allow access to public ressourcesƒ
app.use(express.static(__dirname + '/public'));

const session = require('express-session');
app.use(session({
    secret: require('./config/mysqlCredentials.js').sessionSecret,
    resave: false,
    saveUninitialized: true
}));

/* Setup middleware */
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use("/login", limiter);
app.use("/signup", limiter);

const emailLimiter = rateLimit({
    windowMs: 120 * 60 * 1000, // 2 hour window
    max: 1 // start blocking after 1 request
});
app.use("/email/send", emailLimiter);

// Authentication and Authorization Middleware
var auth = function(req, res, next) {
    if (req.session.loggedin)
    return next();
    else
    return res.sendStatus(401);
};

/* Setup Objection + Knex */
const { Model } = require('objection');
const mdb = require('knex-mariadb');
const Knex = require('knex');
const knexFile = require('./knexfile.js');

const knex = Knex(knexFile.development);

Model.knex(knex);

/* Add routes */
const authRoute = require('./routes/auth.js');
const usersRoute = require('./routes/users.js');
const userRoute = require('./routes/user.js');
const emailRoute = require('./routes/email.js');


app.use(authRoute);
app.use(usersRoute);
app.use(userRoute);
app.use(emailRoute);

/* Start server */
const PORT = 3000;

app.listen(PORT, (error) => {
    if (error) {
        console.log(error);
    }
    console.log("Server is running on port", PORT);
})
