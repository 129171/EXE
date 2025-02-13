
const express = require('express');
const { getUser} = require('../controllers/userController');
const { authenticateUser } = require('../middlewares/authMiddleware'); 

const router = express.Router();


//get user
router.get('/user',authenticateUser, getUser);


module.exports = router;
