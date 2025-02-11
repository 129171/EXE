const jwt = require('jsonwebtoken');
const User = require('../models/User');

const setUser = async (req, res, next) => {
    const token = req.cookies.accessToken;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password'); // Exclude password

            if (user) {
                // Store only essential user details in a cookie
                res.cookie('userData', JSON.stringify({
                    id: user._id,
                    name: user.name,
                    email: user.email
                }), {
                    httpOnly: false, // Set to `true` if you want to prevent JS access (but then frontend must use fetch)
                    secure: true, // Set `false` for development (or use HTTPS in production)
                   
                    path: '/'
                });

                req.user = user; // Attach to request
            }
        } catch (err) {
            console.error("JWT Error:", err);
        }
    }

    next();
};

module.exports = setUser;
