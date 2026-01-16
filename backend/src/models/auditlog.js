const mongoose=require("mongoose");

//write-only history of important actions
const auditSchema=new mongoose.Schema(
    {
        //who did the action?
        actor:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        //what? eg. review approved
        action:{
            type:String,
            required:true
        },
        //eg. Review
        entityType:{
            type:String,
            required:true
        },
        entityId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true
        },
        //Extra reason, eg. rejection reason
        metadata:{
            type:Object
        }
    },
    {
        timestamps:true
    }
);

const Audit=mongoose.model("Audit",auditSchema);

module.exports=Audit;