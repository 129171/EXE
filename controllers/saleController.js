const Sale = require('../models/Sale');

exports.getSales= async (req,res)=> {
    const { startDate, endDate } = req.query;

    const sales = await Sale.aggregate([
        { $match: { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, total: { $sum: "$total" } } },
        { $sort: { _id: 1 } }
    ]);

    res.json(sales);
}