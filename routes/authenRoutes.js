
const express = require('express');
const { googleAuth, googleCallback, logout, refreshToken,getSignIn } = require('../controllers/authenController');

const router = express.Router();

router.get('/sign-in', getSignIn)
// Google OAuth Routes
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

// Logout
router.get('/logout', logout);


//Refresh Access Token
router.post('/refresh-token', refreshToken);


module.exports = router;
