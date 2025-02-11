const express = require('express');
const { getHome, getError} = require('../controllers/homeController');

const router = express.Router();

// Home Page (Always Accessible)
router.get('/', getHome);

router.get('/error', getError);


module.exports = router;
