const mongoose=require("mongoose");

const reviewSchema=mongoose.Schema({
    movietitle:{
        type:String,
        required:true,
        trim:true,
        lowercase:true //to disable case-sensitive
    },
    content:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        min:1,
        max:10,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum: ["draft", "in-review", "published", "archived", "rejected"],
        default: "draft"
    },
    rejectedreason:{
        type:String,
        trim:true
    },
    rejectedby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    views:{
        type:Number,
        default:0
    }
},{
    timestamps:true,
});

const Review=mongoose.model("Review", reviewSchema);

module.exports=Review;