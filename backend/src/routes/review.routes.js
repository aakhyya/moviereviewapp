const express=require("express");
const router=express.Router();

const requireAuth=require("../middlewares/requireAuth");
const requireRole=require("../middlewares/requireRole");
const {
    createReview,
    submitReview,
    approveReview,
    archiveReview,
    getPublishedReviews,
    rejectReview,
    getRejectedreviews,
    resubmitReview,
    getReviewbyId,
    getMyReviews,
    getInReviews, 
    updateReview,
    getReviewForEdit, 
    getReviewForEditor,
    getExistingDrafts
}=require("../controllers/review.controllers")

//critic
router.get("/mine",requireAuth,requireRole("critic"),getMyReviews);
router.get("/draft/:movieId", requireAuth, requireRole("critic"),getExistingDrafts);
router.get("/rejected", requireAuth,requireRole("critic"),getRejectedreviews);
router.get("/:id/edit",requireAuth,requireRole("critic"),getReviewForEdit);
router.post("/movie/:movieId", requireAuth,requireRole("critic"),createReview);
router.post("/:id/submit", requireAuth,requireRole("critic"),submitReview);
router.post("/:id/resubmit", requireAuth,requireRole("critic"),resubmitReview);
router.put("/:id", requireAuth, requireRole("critic"), updateReview);


//editor
router.get("/in-review",requireAuth,requireRole("editor"),getInReviews);
router.get("/editor/:id", requireAuth, requireRole("editor"), getReviewForEditor);
router.post("/:id/approve",requireAuth,requireRole("editor"),approveReview);
router.post("/:id/reject",requireAuth,requireRole("editor"),rejectReview);
router.post("/:id/archive",requireAuth,requireRole("editor"),archiveReview);

//anyone
router.get("/", getPublishedReviews);
router.get("/:id", getReviewbyId);

module.exports=router;