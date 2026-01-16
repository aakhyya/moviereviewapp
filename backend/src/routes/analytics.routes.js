const express=require("express");
const router=express.Router();

const {
    avgRatingPerMovie,
    getCriticStats,
    getEditorStats
}=require("../controllers/analytics.controllers");
const requireAuth=require("../middlewares/requireAuth");
const requireRole=require("../middlewares/requireRole");

//public
router.get("/movie/:movietitle",avgRatingPerMovie);

//critic
router.get("/critic/me", requireAuth, requireRole("critic"), getCriticStats);

//editor
router.get("/editor/me", requireAuth, requireRole("editor"), getEditorStats);

module.exports=router;
