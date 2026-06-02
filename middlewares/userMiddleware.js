const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    try {

        // Get authorization header
        const authHeader = req.headers.authorization;

        // Check if token exists
        if (!authHeader) {

            return res.status(401).json({
                message: "No token provided"
            });

        }

        // Remove Bearer
        const token = authHeader.split(" ")[1];

        // Check token again
        if (!token) {

            return res.status(401).json({
                message: "Invalid token format"
            });

        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Save user info
        req.user = decoded;

        next();

    }

    catch (err) {

        console.log(err);

        return res.status(401).json({
            message: "Invalid token"
        });

    }

};

module.exports = authMiddleware;