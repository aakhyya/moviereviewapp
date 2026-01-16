const Audit=require("../models/auditlog");

async function getAuditlogs(req,res) {
    const logs=await Audit.find() //Find all
                           .populate("actor","name role") 
                           //For human readability & secruity, instead of actor: 383939,
                           //we do actor:{name: "Jane", role:"viewer"}
                           .sort({createdAt:-1})
                           //This orders logs by time: newest → oldest
                           .limit(50);
                           //performance + UX decision: 
                           //Audit logs grow foreverReturning everything is slow
    res.json(logs); 
}

module.exports={getAuditlogs};