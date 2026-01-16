const Review=require("../models/review");

//Only computes, doesn't change data or store result
async function avgRatingPerMovie(req,res){
    const movietitle= req.params.movietitle.toLowerCase();


    //aggregate processes data in stages, returns an array
    const stats= await Review.aggregate([
        {
            //WHERE movietitle = ? AND status = 'published'
            $match:{
                movietitle,
                status:"published"
            }
        },
        {
            $group:{
                _id:"$movietitle",  //group reviews by movie title
                avgRating:{ $avg: "$rating" }, //takes avg of ratings in a group
                totalReviews:{ $sum: 1} //$sum: 1 = “add 1 per document”
            }
        }
    ]);

    res.json(stats[0] || {}); //If no published reviews.
}

//Critic Stats: How many in-draft, published or rejected?
async function getCriticStats(req,res){
    const criticId=req.user.id;

    const stats=await Review.aggregate([
        {
            $match:{ author: criticId}
        },
        {
            $group:{
                _id:"status",
                count:{$sum:1}
            }
        }
    ]);

    res.json(stats);
}

//Editor Stats: How many reviewed, published, rejected?
async function getEditorStats(req,res){
    const editorId=req.user.id;
    //returns no. of documents that match a condition, w/o fetching the documents.
    const rejected=await Review.countDocuments({rejectedby:editorId});
    const published=await Review.countDocuments({status:"published"}); //app-wide, adding editor-specific later

    res.json({
        rejected,
        published
    });
}

module.exports={
    avgRatingPerMovie,
    getCriticStats,
    getEditorStats
};