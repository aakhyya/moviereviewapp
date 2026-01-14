const express=require("express");
const router=express.Router();

const requireAuth=require("../middlewares/requireAuth");
const requireRole=require("../middlewares/requireRole");
const {
    createReview,
    submitReview,
    approveReview,
    archiveReview,
    getPublishedReviews
}=require("../controllers/review.controllers")

//anyone
router.get("/", getPublishedReviews);

//critic
router.post("/", requireAuth,requireRole("critic"),createReview);
router.post("/:id/submit", requireAuth,requireRole("critic"),submitReview);

//editor
router.post("/:id/approve",requireAuth,requireRole("editor"),approveReview);
router.post("/:id/archive",requireAuth,requireRole("editor"),archiveReview);

module.exports=router;