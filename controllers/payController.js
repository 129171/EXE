const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();
const PayOs = require('@payos/node')

const payOs = new PayOs(
    process.env.PAY_CLIENT_ID,
    process.env.PAY_API_KEY,
    process.env.PAY_CHECKSUM_KEY
);


exports.cancel = async (req, res) => {
    res.render('cancel');
};

exports.pay = async (req, res) => {
    try {
        const userData = req.cookies.userData ? JSON.parse(req.cookies.userData) : null;
        if (!userData) {
         return res.status(401).render('errors', { message: 'User not authenticated' });

        }

        // Extend VIP membership for 30 days
        const premiumExpirationDate = new Date();
        premiumExpirationDate.setDate(premiumExpirationDate.getDate() + 30);
        console.log(userData.id);
        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userData.id,
            {
                is_verified: true,
                is_premium: true,
                premium_expired_at: premiumExpirationDate
            },
            { new: true }
        );

        if (!updatedUser) {
         return res.status(404).render('errors', { message: 'User not found' });

        }
        const orderCode = Date.now() % 9007199254740991;
        // Create payment order
        const order = {
            amount: 3000,
            description: 'Buying V.I.P membership',
            orderCode,
            returnUrl: process.env.DOMAIN+'/',
            cancelUrl: process.env.DOMAIN+'/pay/cancel'
        };
        console.log("Order data:", order);

        const paymentLink = await payOs.createPaymentLink(order);
        res.redirect(303, paymentLink.checkoutUrl);
    } catch (error) {
        console.error("Payment error:", error);
        return res.status(500).render('errors', { message: "Internal Server Error"  });

    }
};
