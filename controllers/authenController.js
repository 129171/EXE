const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.getSignIn = async (req, res) => {
  res.render('signin');
};

exports.googleCallback = (req, res, next) => {
  passport.authenticate('google', async (err, user, info) => {
    if (err) {
      console.error("Passport error:", err);
      return res.redirect('/error');
    }
    if (!user) {
      console.error("Google authentication failed.");
      return res.redirect('/error');
    }

    try {
      const email = user.emails?.[0]?.value || user.email || user._json?.email;
      if (!email) {
        console.error("No email found in Google profile");
        return res.redirect('/error');
      }

      // Find or create user
      let existingUser = await User.findOne({ $or: [{ googleId: user.id }, { email }] });

      if (!existingUser) {
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
          existingUser.password = await bcrypt.hash('123', 10);
          updated = true;
        }
        if (updated) await existingUser.save();
      }

      // Ensure session is saved properly
      req.login(existingUser, (err) => {
        if (err) {
          console.error("Login error:", err);
          return res.redirect('/error');
        }

        console.log("User successfully logged in:", req.user);

        // Generate JWTs
        const accessToken = generateAccessToken(existingUser);
        const refreshToken = generateRefreshToken(existingUser);

        // Set cookies
        res.cookie('accessToken', accessToken, {
          httpOnly: true, // Set to true for security
          secure: false, // Change to true in production with HTTPS
          sameSite: 'Strict',
          maxAge: 15 * 60 * 1000 // 15 minutes
        });
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: false
        });

        return res.redirect('/');
      });
    } catch (error) {
      console.error("Error processing Google login:", error);
      return res.redirect('/error');
    }
  })(req, res, next);
};

exports.logout = (req, res) => {
  try {
    console.log("Session before logout:", req.session);
    console.log("User before logout:", req.user);
    res.clearCookie('userData', { path: '/', httpOnly: true, secure: false, sameSite: 'Strict' });
    // Clear JWT cookies
    res.clearCookie('accessToken', { path: '/', httpOnly: true, sameSite: 'Lax' });
    res.clearCookie('refreshToken', { path: '/', httpOnly: true, sameSite: 'Lax' });

    // Destroy session properly
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).send("Logout failed");
      }

      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          return res.status(500).send("Logout failed");
        }

        console.log("User logged out successfully");
        console.log("Session after logout:", req.session);
        console.log("User after logout:", req.user);
        res.redirect('/');
      });
    });
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

      const newAccessToken = generateAccessToken({ id: decoded.id });

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
