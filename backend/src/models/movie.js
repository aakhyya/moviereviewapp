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
        }
    },
    {
        timestamps:true
    }
);

const Movie=mongoose.model("Movie",movieSchema);
module.exports=Movie;
