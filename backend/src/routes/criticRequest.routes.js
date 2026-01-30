const express=require("express");
const router=express.Router();
const requireAuth = require("../middlewares/requireAuth");
const requireRole = require("../middlewares/requireRole");
const {
    createCriticRequest,
    getPendingRequests,
    approveCriticRequest,
    rejectCriticRequest
}=require("../controllers/criticRequest.controllers");

//viewer
router.post("/request",requireAuth,requireRole("viewer"),createCriticRequest);

//editor
router.get("/pending",requireAuth,requireRole("editor"),getPendingRequests);
router.post("/:id/approve",requireAuth,requireRole("editor"),approveCriticRequest);
router.post("/:id/reject",requireAuth,requireRole("editor"),rejectCriticRequest);

module.exports=router;