const User = require('../models/User');
const Favorite = require('../models/Favorite')
const jwt = require('jsonwebtoken'); // Add this import

exports.getUser = async (req, res) => {
    try {
        // The user should already be available from the middleware
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const favorites = await Favorite.find({ userId: user._id }).populate('sound');
        res.render('profile', { user, favorites });
    } catch (error) {
        console.error("Profile access error:", error);
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};