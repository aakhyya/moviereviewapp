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
    resubmitReview
}=require("../controllers/review.controllers")

//anyone
router.get("/", getPublishedReviews);

//critic
router.post("/", requireAuth,requireRole("critic"),createReview);
router.post("/:id/submit", requireAuth,requireRole("critic"),submitReview);
router.get("/rejected", requireAuth,requireRole("critic"),getRejectedreviews);
router.post("/:id/resubmit", requireAuth,requireRole("critic"),resubmitReview);

//editor
router.post("/:id/approve",requireAuth,requireRole("editor"),approveReview);
router.post("/:id/reject",requireAuth,requireRole("editor"),rejectReview);
router.post("/:id/archive",requireAuth,requireRole("editor"),archiveReview);

module.exports=router;