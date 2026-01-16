const express=require("express");
const router=express.Router();

const {getAuditlogs}=require("../controllers/audit.controllers");
const requireAuth=require("../middlewares/requireAuth");
const requireRole=require("../middlewares/requireRole");

router.get("/",requireAuth,requireRole("editor"),getAuditlogs);

module.exports=router;