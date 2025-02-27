const express = require('express');
const {  getError, getDashboard} = require('../controllers/homeController');
const { authenticateUser, hasRole} = require('../middlewares/authMiddleware'); 

const router = express.Router();

// Home Page (Always Accessible)

router.get('/error', getError);
router.get('/admin',authenticateUser,hasRole('admin'), getDashboard);

module.exports = router;
