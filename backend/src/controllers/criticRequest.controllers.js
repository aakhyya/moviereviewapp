const mongoose=require("mongoose");
const CriticRequest=require("../models/criticRequest");
const Audit=require("../models/auditlog");
const User=require("../models/user");

async function createCriticRequest(req,res){
    try{
        const {reason,portfolioLink}=req.body;
        const existing=await CriticRequest.findOne({
            user:req.user.id,
            status:"pending",
        });
        if(existing){
            return res.status(400).json({
                error: "You already have a pending request",
            });
        }

        const request=await CriticRequest.create({
            user:req.user.id,
            reason,
            portfolioLink,
        });
        await Audit.create({
            actor: req.user.id,
            action: "CRITIC_REQUEST_CREATED",
            entityType: "CriticRequest",
            entityId: request._id,
        });

        res.status(201).json({
            message: "Critic request submitted",
        });
    }
    catch(err){
        res.status(500).json({ error: "Internal server error" });
    }
};

async function getPendingRequests(req,res){
    try{
        const requests=await CriticRequest.find({status:"pending"})
                                            .populate("user","name email")
                                            .sort({createdAt:-1});
        res.json(requests);
    }
    catch(err){
        res.status(500).json({ error: "Internal server error" });
    }
}

async function approveCriticRequest(req,res) {
    try{
        const request=await CriticRequest.findById(req.params.id);
        if(!request || request.status!=="pending"){
            return res.status(400).json({
                error: "Request not found or already processed",
            });
        }

        const user=await User.findById(request.user);
        user.role="critic";
        await user.save();

        request.status = "approved";
        request.reviewedBy = req.user.id;
        request.reviewedAt = new Date();
        await request.save();

        await Audit.create({
        actor: req.user.id,
        action: "CRITIC_REQUEST_APPROVED",
        entityType: "User",
        entityId: user._id,
        metadata: {
            previousRole: "viewer",
            newRole: "critic",
        },
        });

        res.json({ message: "User promoted to critic" });
    }
    catch(err){
        res.status(500).json({ error: "Internal server error" });
    }
}

async function rejectCriticRequest(req,res){
    try{
        const request = await CriticRequest.findById(req.params.id);

        if (!request || request.status !== "pending") {
            return res.status(400).json({
                error: "Request not found or already processed",
            });
        }

        request.status = "rejected";
        request.reviewedBy = req.user.id;
        request.reviewedAt = new Date();
        await request.save();

        await Audit.create({
            actor: req.user.id,
            action: "CRITIC_REQUEST_REJECTED",
            entityType: "CriticRequest",
            entityId: request._id,
        });

        res.json({ message: "Critic request rejected" });
    }
    catch(err){
        res.status(500).json({ error: "Internal server error" });
    }
}


module.exports={
    createCriticRequest,
    getPendingRequests,
    approveCriticRequest,
    rejectCriticRequest
};
