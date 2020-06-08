// Checks to see if a session variable isset to verify that a user is authenticated and continues to next route
module.exports.loggedin = (req, res, next) => {
    if(req.session.loggedin){
        next();
    }else{
        res.status(401).redirect('/login');
    }
}