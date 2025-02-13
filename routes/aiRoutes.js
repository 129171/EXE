const express = require('express');
const { searchInDatabase } = require('../controllers/aiController')
const router = express.Router();

router.post('/search', searchInDatabase);
module.exports = router;
