const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');
const jwt = require('jsonwebtoken');

exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });
exports.getSignIn = async (req, res) => {
  res.render('signin'); 
}
exports.googleCallback = (req, res, next) => {
  passport.authenticate('google', async (err, user, info) => {
    if (err || !user) return res.redirect('/error');

    try {
      const email = user.emails?.[0]?.value || user.email || user._json?.email;

      if (!email) {
        console.error("No email found in Google profile");
        return res.redirect('/error');
      }

      // Find user by Google ID or email
      let existingUser = await User.findOne({ $or: [{ googleId: user.id }, { email }] });

      if (!existingUser) {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash('123', 10);

        existingUser = new User({
          googleId: user.id,
          name: user.displayName,
          email,
          password: hashedPassword
        });

        await existingUser.save();
      } else {
        let updated = false;

        if (!existingUser.googleId) {
          existingUser.googleId = user.id;
          updated = true;
        }

        if (!existingUser.password) {
          // Set and hash the password if it's missing
          existingUser.password = await bcrypt.hash('123', 10);
          updated = true;
        }

        if (updated) {
          await existingUser.save();
        }
      }

      const accessToken = generateAccessToken(existingUser);
      const refreshToken = generateRefreshToken(existingUser);

      res.cookie('accessToken', accessToken, {
        httpOnly: false, // Change to true in production
        secure: false, // Change to true if using HTTPS
        sameSite: 'Strict',
        path: '/',
        maxAge: 15 * 60 * 1000 // 15 minutes
    });
      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false });

      return res.redirect('/');
    } catch (error) {
      console.error("Error processing Google login:", error);
      return res.redirect('/error');
    }
  })(req, res, next);
};

exports.logout = (req, res) => {
  try {
    // Clear cookies explicitly
    res.clearCookie('accessToken', { path: '/', httpOnly: false, secure: true, sameSite: 'Strict' });
    res.clearCookie('refreshToken', { path: '/', httpOnly: false, secure: true, sameSite: 'Strict' });

    // If using sessions, destroy the session
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
        }
        req.logout(() => {
          res.redirect('/');
        });
      });
    } else {
      req.logout(() => {
        res.redirect('/');
      });
    }
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).send("Logout failed");
  }
};



// Middleware to check authentication
exports.refreshToken = (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
      if (err) {
        console.error("Refresh token verification failed:", err);
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '15m' });

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        sameSite: "Strict"
      });

      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error("Error in refreshToken handler:", error);
    res.status(500).json({ message: "Server error" });
  }
};

