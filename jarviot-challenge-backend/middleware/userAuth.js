const jwt = require("jsonwebtoken");
const createCustomAPIError = require("../errors/error-handler");
const asyncWrapper = require("./async");
const User = require("../models/User");
require("dotenv").config();

// Protect routes
const protect = asyncWrapper(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    // Checking if token exists
    if (!token) {
        return next(
            createCustomAPIError("Not authorized to access this route", 401),
        );
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decodedToken.id);
        next();
    } catch (error) {
        return next(createCustomAPIError("Protected route", 401));
    }
});

module.exports = protect;
