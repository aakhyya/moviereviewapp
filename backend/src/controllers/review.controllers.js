const Review=require("../models/review");

//critic: draft
async function createReview(req,res) {
    console.log("REQ.USER →", req.user);
    const {movietitle,content,rating}=req.body;
    if(!movietitle || !content || !rating){
        return res.status(400).json({
            error:"All fields required!",
        });
    }

    const review=await Review.create({
        movietitle,
        content,
        rating,
        author:req.user.id
    });
    return res.status(201).json(review);
}

//critic: submit for review
async function submitReview(req,res) {
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

    review.status="in-review";
    await review.save();
    return res.json({
        message:"Draft is in-review stage."
    });
}

//editor: approve review
async function approveReview(req,res){
    const review=await Review.findById(req.params.id);
    if(!review){
        return res.status(404).json({
            error:"Review not found!"
        });
    }

    review.status="published";
    await review.save();
    return res.json({
        message:"Review is published"
    });
}

//editor: archive review
async function archiveReview(req,res){
    const review=await Review.findById(req.params.id);
    if(!review){
        return res.status(404).json({
            error:"Review not found!"
        });
    }

    review.status="archived";
    await review.save();
    return res.json({
        message:"Review is archived"
    });
}

//anyone can read published drafts
async function getPublishedReviews(req,res){
    const reviews=await Review.find({status:"published"})
                            .populate("author","name");
    // Take the author ObjectId, go to the User collection,
    // find the matching user, and replace the ID with selected user fields,
    // we write "name" specifically, so that other fields of user don't return.
    return res.json(reviews);   
}

module.exports={createReview,submitReview,approveReview,archiveReview,getPublishedReviews};