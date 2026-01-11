const express=require("express");

const router=express.Router();

router.get("/health", async (req,res)=>{
    res.status(200).json({
        status: "ok",
        uptime: process.uptime(), //how long app been running
    })
})

module.exports=router;