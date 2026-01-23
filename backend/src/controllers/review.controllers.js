const Review=require("../models/review");
const Audit=require("../models/auditlog");
const Movie = require("../models/movie");

//CRITIC
//1. draft
async function createReview(req,res) {
    const { content, rating } = req.body;
    const { movieId } = req.params;
    const movie = await Movie.findById(movieId);
    if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
    }

    if (!movieId || !content || !rating) {
        return res.status(400).json({ error: "All fields required" });
    }

    const review = await Review.create({
        movie: movieId,
        content,
        rating,
        author: req.user.id,
    });

    res.status(201).json(review);
}
//2. submit for review
async function submitReview(req,res) {
    const review=await Review.findById(req.params.id).populate("movie");
    if(!review){
        return res.status(404).json({
            error:"Review not found!"
        });
    }
    if(review.author.toString()!==req.user.id){
        return res.status(403).json({
            error:"Access denied! Not your review!"
        });
    }
    if (review.status !== "draft") {
        return res.status(400).json({
            error: "Only drafts can be submitted for review!"
        });
    }

    review.status="in-review";
    await review.save();
    await Audit.create({
        actor:req.user.id,
        action:"REVIEW_SUBMITTED",
        entityType:"Review",
        entityId:review._id,
        metadata:{
            previousStatus:"draft"
        }
    });
    return res.json({
        message:"Draft is in-review stage."
    });
}
//3. see my own reviews
async function getMyReviews(req,res){
    const reviews=await Review.find({
        author:req.user.id
    })
    .populate("author", "name")
    .populate("movie")
    .sort({createdAt:-1});

    if (reviews.length === 0) {
        return res.json([]);
    }

    res.json(reviews);
}
//4. see their rejected reviews
    async function getRejectedreviews(req,res){
        const reviews=await Review.find({
            author:req.user.id,
            status:"rejected"
        })
        .populate("rejectedby","name")
        .populate("movie");;
        if (reviews.length === 0) {
            return res.json([]);
        }
        return res.json(reviews);
    }
//5. resubmit their rejected reviews
async function resubmitReview(req,res){
    const review=await Review.findById(req.params.id);
    if(!review){
        return res.status(404).json({
            error:"Review not found!"
        });
    }
    if(review.author.toString()!==req.user.id){
        return res.status(403).json({
            error:"Access denied! Not your review!"
        });
    }
    if(review.status!=="rejected"){
        return res.status(400).json({
            error:"Only rejected reviews can be resubmitted!"
        });
    }

    review.status = "in-review";
    review.rejectedreason = undefined;
    review.rejectedby = undefined;
    await review.save();
    await Audit.create({
        actor:req.user.id,
        action:"REVIEW_RESUBMITTED",
        entityType:"Review",
        entityId:review._id,
        metadata:{
            previousStatus:"rejected"
        }
    });
    return res.json({
        message:"Review resubmitted for review."
    });
}
// 6. update review for resubmission
async function updateReview(req,res) {
    const { rating, content } = req.body;
    if (!rating || !content) {
        return res.status(400).json({
            error: "Rating and content are required",
        });
    }

    const review=await Review.findById(req.params.id);
    if(!review){
        return res.status(404).json({
            error:"Review not found!"
        });
    }

    if (review.author.toString() !== req.user.id) {
        return res.status(403).json({
            error: "Access denied! Not your review!",
        });
    }

    if(review.status!=="rejected"){
        return res.status(400).json({
            error:"Only rejected reviews can be edited!"
        });
    }

    review.rating = rating;
    review.content = content;

    await review.save();

    await Audit.create({
        actor: req.user.id,
        action: "REVIEW_UPDATED",
        entityType: "Review",
        entityId: review._id,
        metadata: {
            status: "rejected",
        },
    });

    return res.json({
        message: "Review updated successfully",
    });

}
//7. get review by id for edit
async function getReviewForEdit(req,res) {
    const review = await Review.findById(req.params.id).populate("movie");;

    if (!review) {
        return res.status(404).json({ error: "Review not found" });
    }

    // Only author can edit
    if (review.author.toString() !== req.user.id) {
        return res.status(403).json({ error: "Access denied" });
    }

    // Only rejected reviews can be edited
    if (review.status !== "rejected") {
        return res.status(400).json({
            error: "Only rejected reviews can be edited"
        });
    }

    res.json(review);
}

//EDITOR 
//1. approve review
async function approveReview(req,res){
    const review=await Review.findById(req.params.id);
    if(!review){
        return res.status(404).json({
            error:"Review not found!"
        });
    }

    if(review.status!=="in-review"){
        return res.status(400).json({
            error:"Only reviews 'in-review' can be approved!"
        });
    }
    review.status = "published";
    review.rejectedreason = undefined;
    review.rejectedby = undefined;
    await review.save();
    await Audit.create({
        actor:req.user.id,
        action:"REVIEW_APPROVED",
        entityType:"Review",
        entityId:review._id,
        metadata:{
            previousStatus:"in-review"
        }
    });
    return res.json({
        message:"Review is published"
    });
}
//2. reject review
async function rejectReview(req,res){
    const {reason}=req.body;
    if(!reason){
        return res.status(400).json({
            error:"Rejection Reason is required!"
        });
    }
    const review=await Review.findById(req.params.id);
    if(!review){
        return res.status(404).json({
            error:"Review not found!"
        });
    }
    if(review.status!=="in-review"){
        return res.status(400).json({
            error:"Only reviews 'in-review' can be rejected!"
        });
    }

    review.status="rejected";
    review.rejectedreason=reason;
    review.rejectedby=req.user.id;
    await review.save();
    await Audit.create({
        actor:req.user.id,
        action:"REVIEW_REJECTED",
        entityType:"Review",
        entityId:review._id,
        metadata:{
            reason
        }
    });
    return res.json({
        message:"Review rejected with feedback!"
    });
}
//3. archive review
async function archiveReview(req,res){
    const review=await Review.findById(req.params.id);
    if(!review){
        return res.status(404).json({
            error:"Review not found!"
        });
    }
    if (review.status !== "published") {
        return res.status(400).json({
            error: "Only published reviews can be archived",
        });
    }

    review.status="archived";
    await review.save();
    await Audit.create({
        actor:req.user.id,
        action:"REVIEW_ARCHIVED",
        entityType:"Review",
        entityId:review._id,
        metadata:{
            previousStatus:"published"
        }
    });
    return res.json({
        message:"Review is archived"
    });
}
//4. get in-review reviews
async function getInReviews(req,res){
    const reviews = await Review.find({ status: "in-review" })
                                .populate("author", "name")
                                .populate("movie");;
    if (reviews.length === 0) {
            return res.json([]);
    }
    res.json(reviews);
}

//VIEWERS
//1. read published drafts
async function getPublishedReviews(req,res){
    const reviews=await Review.find({status:"published"})
                            .populate("author","name")
                            .populate("movie");;
    return res.json(reviews);   
}

//ANALYTICS
//1. Increment when a review is read
async function getReviewbyId(req,res){
    const review=await Review.findOne({
        _id:req.params.id,
        status:"published"
    })
    .populate("author","name")
    .populate("movie");
    if(!review){
        return res.status(404).json({
            error:"Review not found!"
        });
    }
    review.views+=1;
    await review.save();

    return res.json(review);
}

module.exports={getPublishedReviews, getReviewbyId,
                approveReview,archiveReview,rejectReview,getInReviews,
                createReview,submitReview,getMyReviews,getRejectedreviews,resubmitReview,updateReview,getReviewForEdit};