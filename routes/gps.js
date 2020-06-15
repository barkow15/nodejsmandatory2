const middleware = require('../middleware/middleware.js');
const router = require('express').Router();

//const io = require('socket.io');

/* Setup fs */
const fs = require('fs'); 

// load header and footer html templates
const header = fs.readFileSync("public/header/header.html", "utf8");
const footer = fs.readFileSync("public/footer/footer.html", "utf8");

router.get('/gps/track', /*middleware.loggedin,*/ async (req, res) => {
/*     const users = await User.query().select('username').withGraphFetched('role');
    return res.send({ response: users }); */

    
    const track = fs.readFileSync("public/gps/track/track.html");
    
    return res.status(200).send(header + track + footer);
});

// Route that handles recieving data 
router.post('/gps/emitlocation', (req, res) => {
    const io = req.app.locals.io

    let locationsJSON = req.body;
    let locations = "";

    for(locationJson in locationsJSON){
        locations = JSON.parse(`[${locationJson}]`);
    }
    
    if(locations == ""){
        return res.status(400).send("There was an error in parsing locations as JSON. Please try again.");
    }else{
        io.sockets.emit('locations', {
            locations: locations
        });
        return res.status(200);
    }
});

module.exports = router;