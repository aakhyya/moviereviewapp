const mongoose=require("mongoose");
const bcrypt=require("bcrypt");

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim: true, //avoid bugs by whitespace
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type: String,
        enum: ["viewer", "critic", "editor"],
        default:"viewer",
    }
},
{
    timestamps:true
});

//Runs before anything is saved in mongodb, 
//we do this to avoid saving plain text password anywhere, 
//not even in MongoDB.
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next(); //Re-Hash only if password modified
    try{
        this.password=await bcrypt.hash(this.password,10); //password,saltRounds : Higher, more secure, slower
        next();
    }
    catch(err){
        next(err);
    }
});

userSchema.methods.matchPassword=async function(userpassword){
    return bcrypt.compare(userpassword,this.password); //new,original
};

const User=mongoose.model("User",userSchema);

module.exports=User;