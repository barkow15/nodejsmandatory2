const router = require('express').Router();

const User = require('../models/User.js');
const Role = require('../models/Role.js');

/* Setup fs */
const fs = require('fs'); 

const bcrypt = require('bcrypt');
const saltRounds = 12;

// load header and footer html templates
const header = fs.readFileSync("public/header/header.html", "utf8");
const footer = fs.readFileSync("public/footer/footer.html", "utf8");

router.get(['/','/login'], (req, res) => {
    const login = fs.readFileSync("public/login/login.html");

    return res.status(200).send(header + login + footer);
});

router.post("/login", async (req, res) => {
    // We use the middleware body-parser to parse the body of our request
    const credentials = req.body;
    const redirectURL = `/user/dashboard`; // Url to redirect to if user is succesfully authentiacted
    const username = credentials.username;
    const password = credentials.password;

    // 1. retrieve the login details and validate
    if(username === "" || username == undefined || username == null){
        // Stop execution by sending a res with a "i'm a teapot" statuscode just for fun to indiciate error
        return res.status(418).send({ response : "No username was recieved on server. Please make sure that you entered a username." });
    }

    if(password === "" || password == undefined || password == null){
        return res.status(400).send({ response : "No password was recieved on server. Please make sure that you entered a password." });
    }

    // 2. check for a user match in the database
    const userFound = await User.query().select().where({ 'username': username }).limit(1);
    if (userFound.length <= 0) {
        return res.status(400).send({ response: "No user found with the supplied username. Please try again." });
    }

    // 3. bcrypt compare
    const passwordFoundVal = userFound[0].password; 

    bcrypt.compare(password, passwordFoundVal).then((result) => {
        // If password comparison output is true
        if(result){
            req.session.loggedin = true; // Set session variable loggedin to true

            return res.status(200).send({ 
                response: "User was succesfully authenticated", 
                redirectURL: redirectURL
            });
        }else{
            return res.status(400).send({ response: "Password does not match the entered username. Please try again with a different password." });
        }
    });    
    // 4. sessions

});

router.get("/signup", (req, res) => {
    const signup = fs.readFileSync("public/signup/signup.html");

    return res.status(200).send(header + signup + footer);
});

router.post("/signup", async (req, res) => {
    const redirectURL = '/login';
    // what fields do we need to sign up?
    // username, password, repeat password
    const { username, password, passwordRepeat } = req.body;
    
    const isPasswordTheSame = password === passwordRepeat;
    
    if (username && password && isPasswordTheSame) {
        // password requirements
        if (password.length < 8) {
            return res.status(400).send({ response: "Password does not fulfill the requirements. Password has to consist of 8 or more characters" });
        } else {
            try {
                
            const userFound = await User.query().select().where({ 'username': username }).limit(1);
            if (userFound.length > 0) {
                return res.status(400).send({ response: "User already exists" });
            } else {
                const defaultUserRoles = await Role.query().select().where({ role: 'USER' });

                const hashedPassword = await bcrypt.hash(password, saltRounds);
                const createdUser = await User.query().insert({
                    username,
                    password: hashedPassword,
                    roleId: defaultUserRoles[0].id
                });

                return res.send({ 
                    response: `User has been created with the username ${createdUser.username}`, 
                    redirectURL: redirectURL
                });
            }

            } catch (error) {
                return res.status(500).send({ response: "Something went wrong with the database" });
            }
        }
    } else if (password && passwordRepeat && !isPasswordTheSame) {
        return res.status(400).send({ response: "Passwords do not match. Fields: password and passwordRepeat" });
    } else {
        return res.status(404).send({ response: "Missing fields: username, password, passwordRepeat" });
    }
    
});

router.get("/logout", (req, res) => {
    // todo destroy the session
    req.session.destroy();
    
    return res.status(200).send({ response: "Logged out" });
});

module.exports = router;