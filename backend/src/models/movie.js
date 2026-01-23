const mongoose=require("mongoose");

const movieSchema=new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        releaseYear: {
            type: Number,
            required: true,
        },
        posterUrl: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            trim: true,
        },
        //for searching on basis of movie, but actually fetching through id:hybrid approach
        slug: {
            type: String,
            unique: true,
            index: true,
        },
        //editor who added movie
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps:true
    }
);

const Movie=mongoose.model("Movie",movieSchema);
module.exports=Movie;
