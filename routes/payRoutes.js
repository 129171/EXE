const express = require('express');
const { pay,cancel } = require('../controllers/payController')
const { authenticateUser,canPurchasePremium } = require('../middlewares/authMiddleware'); 

const router = express.Router();
router.get('/cancel',cancel)
router.post('/pay',authenticateUser,canPurchasePremium,pay)
module.exports = router;
