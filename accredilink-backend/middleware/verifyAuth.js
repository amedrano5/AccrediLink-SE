const jwt = require('jsonwebtoken');


const verifyAuth = (req, res, next) => {
    try {
        if(!req.headers.authorization) throw new Error('Unauthorized!');
        let decoded = jwt.verify(req.headers.authorization, "accredusers");
        next();
    } catch (error) {
        throw new Error('Unauthorized!');
    }
}

module.exports = verifyAuth;