// Code Walkthrough - Sample Document Structure
/*
{
    "_id": ObjectId("..."),
    "movie": "Edge of Tomorrow",
    "genre": "Sci-Fi",
    "country": "USA",
    "views": 15000,
    "rating": 8.2,
    "year": 2024
}
*/

// Code Walkthrough - Average Rating and Total Views per Genre in USA
db.watchHistory.aggregate([
    { $match: { country: "USA" } },
    {
        $group: {
            _id: "$genre",
            totalViews: { $sum: "$views" },
            avgRating: { $avg: "$rating" }
        }
    },
    {
        $project: {
            _id: 0,
            genre: "$_id",
            totalViews: 1,
            avgRating: { $round: ["$avgRating", 2] }
        }
    }
]);

// Code Walkthrough - Top 5 Movies by Views in 2024
db.watchHistory.aggregate([
    { $match: { year: 2024 } },
    { $sort: { views: -1 } },
    { $limit: 5 },
    { $project: { _id: 0, movie: 1, views: 1 } }
]);

// Code Walkthrough - Count Movies per Genre
db.watchHistory.aggregate([
    { $group: { _id: "$genre", count: { $sum: 1 } } },
    { $project: { _id: 0, genre: "$_id", count: 1 } }
]);

// Challenge: Average Rating for Each Genre in 2024 with >10,000 views
db.watchHistory.aggregate([
    { $match: { year: 2024 } },
    {
        $group: {
            _id: "$genre",
            totalViews: { $sum: "$views" },
            avgRating: { $avg: "$rating" }
        }
    },
    { $match: { totalViews: { $gt: 10000 } } },
    {
        $project: {
            _id: 0,
            genre: "$_id",
            avgRating: { $round: ["$avgRating", 1] },
            totalViews: 1
        }
    }
]);
