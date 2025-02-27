const Sale = require("../models/Sale");
const User = require("../models/User");

exports.getError = async (req, res) => {
    res.render('error'); // Ensure 'index' template exists in 'views'
}
exports.getFavorite = async (req,res) => {

}

exports.getDashboard = async (req, res) => {
    try {
        // Get total sales for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalSales = await Sale.aggregate([
            { $match: { createdAt: { $gte: today }, status: "completed" } },
            { $group: { _id: null, total: { $sum: "$total" } } }
        ]);

        // Get total sales for the current month
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const monthlySales = await Sale.aggregate([
            { $match: { createdAt: { $gte: firstDayOfMonth }, status: "completed" } },
            { $group: { _id: null, total: { $sum: "$total" } } }
        ]);

        // Get daily sales for the month
        const salesData = await Sale.aggregate([
            { $match: { createdAt: { $gte: firstDayOfMonth }, status: "completed" } },
            { 
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    total: { $sum: "$total" }
                } 
            },
            { $sort: { _id: 1 } }
        ]);

        // Format data for the frontend
        const formattedSalesData = salesData.reduce((acc, sale) => {
            acc[sale._id] = sale.total;
            return acc;
        }, {});
        const users = await User.find({ role: { $ne: "admin" } });

        res.render('admin_dashboard', {
            totalSales: totalSales[0]?.total || 0,
            monthlySales: monthlySales[0]?.total || 0,
            salesData: JSON.stringify(formattedSalesData),
            users
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).send("Internal Server Error");
    }
};

// Export the function properly

