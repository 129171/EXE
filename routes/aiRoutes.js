const express = require('express');
const { searchInDatabase, chatbox } = require('../controllers/aiController')
const router = express.Router();
const multer = require('multer');
const upload = multer({dest:'uploads/'})

router.post('/search', searchInDatabase);
router.post('/get',upload.single('file'), chatbox)
module.exports = router;
