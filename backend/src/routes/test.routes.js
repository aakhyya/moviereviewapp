const express=require("express");
const router=express.Router();

const requireAuth=require("../middlewares/requireAuth");
const requireRole=require("../middlewares/requireRole");

router.get("/viewer", requireAuth, (req,res)=>{
    res.json({
        message:"Viewer Access Granted"
    })
});

router.get("/critic", requireAuth, requireRole("critic", "editor"), (req,res)=>{
    res.json({
        message:"Critic Access Granted"
    })
});

router.get("/editor", requireAuth, requireRole("editor"), (req,res)=>{
    res.json({
        message:"Editor Access Granted"
    })
});

module.exports=router;