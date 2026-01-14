const mongoose=require("mongoose");

const reviewSchema=mongoose.Schema({
    movietitle:{
        type:String,
        required:true,
        trim:true
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
        enum: ["draft", "in-review", "published", "archived"],
        default: "draft"
    },
},{
    timestamps:true,
});

const Review=mongoose.model("Review", reviewSchema);

module.exports=Review;