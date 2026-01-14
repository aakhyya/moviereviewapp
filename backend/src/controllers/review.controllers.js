const Review=require("../models/review");

//CRITIC
//1. draft
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
//2. submit for review
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
//3. see their rejected reviews
async function getRejectedreviews(req,res){
    const reviews=await Review.find({
        author:req.user.id,
        status:"rejected"
    }).populate("rejectedby","name");
    if(!reviews){
        return res.status(404).json({
            error:"No rejected reviews!"
        });
    }
    return res.json(reviews);

}
//4. resubmit their rejected reviews
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

    review.status="in-review";
    await review.save();

    return res.json({
        message:"Review resubmitted for review."
    });
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
    review.status="published";
    await review.save();
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

    review.status="archived";
    await review.save();
    return res.json({
        message:"Review is archived"
    });
}

//VIEWERS
//1. read published drafts
async function getPublishedReviews(req,res){
    const reviews=await Review.find({status:"published"})
                            .populate("author","name");
    // Take the author ObjectId, go to the User collection,
    // find the matching user, and replace the ID with selected user fields,
    // we write "name" specifically, so that other fields of user don't return.
    return res.json(reviews);   
}

module.exports={getPublishedReviews,
                approveReview,archiveReview,rejectReview,
                createReview,submitReview,getRejectedreviews,resubmitReview};