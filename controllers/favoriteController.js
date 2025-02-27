const Favorite = require('../models/Favorite')

exports.getMostFavorite = async (req,res)=> {
    const { startDate, endDate } = req.query;
    
    const favorites = await Favorite.aggregate([
        { $match: { date: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
        { $group: { _id: "$sound", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $lookup: { from: "sounds", localField: "_id", foreignField: "_id", as: "song" } },
        { $unwind: "$song" },
        { $project: { songName: "$song.name", count: 1 } }
    ]);

    res.json(favorites);
}