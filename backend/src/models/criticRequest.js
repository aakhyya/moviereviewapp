const mongoose=require("mongoose");

const criticRequestSchema=new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true, // only one active request per user
        },

        reason: {
            type: String,
            trim: true,
        },

        portfolioLink: {
            type: String,
            trim: true,
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        reviewedAt: {
            type: Date,
        },
    },
    {
        timestamps:true,
    }
);

const CriticRequest=mongoose.model("CriticRequest",criticRequestSchema);
module.exports=CriticRequest;