const jwt = require("jsonwebtoken");

//NOTE: this middleware only sets fields, and does not block anything in case authentication fails
const authMiddleware = (req, res, next) => {
    const authHeader = req.get("Authorization");

    if(!authHeader){
        req.isAuth = false;
        return next();
    }

    const token = authHeader.split(" ").at(1); //Naming convention -> Authorization: Bearer token_value

    if(!token || token === ""){
        req.isAuth = false;
        return next();
    }

    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        req.isAuth = false;
        return next();
    }   

    if(!decodedToken){
        req.isAuth = false;
        return next();
    }

    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
};

module.exports = authMiddleware;