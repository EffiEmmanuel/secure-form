const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/user');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    console.log(req.headers)

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            console.log(token);

            // Verify token
            const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);

            // Get User from the token
            req.user = await User.findById(decoded.id);

            next();
        } catch (error) {
            console.log(error);
            res.status(400);
            throw new Error('Not Authorized');
        }
    }

    if(!token) {
        res.status(401);
        throw new Error('Not Authorized: No token');
    }
});


module.exports = { protect };