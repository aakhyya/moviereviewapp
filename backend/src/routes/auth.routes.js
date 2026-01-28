const express=require("express");
const router=express.Router();
const {signupController,loginController}=require("../controllers/auth.controllers");

const passport=require("passport");
const jwt=require("jsonwebtoken");

//Signup
//1. local
router.post("/signup", signupController);
//2.google
router.get("/google", //User hits by clicking a button
    passport.authenticate("google",{ //tells passport to use the Google strategy we registered earlier
        scope:["profile","email"], //asking Google for permission to access profile, email(keep it minimal)
    }) //Browser redirected to Google
);
router.get("/google/callback", //Redirects Browser here after login
    passport.authenticate("google", //reads google's response, verifies signature, 
                                    // runs googlestrategy callback, sets req.user
       {session: false} //no cookies, no server memory, only JWT auth.
    ),
    (req,res)=>{
        const user=req.user; 
        const token=jwt.sign(
            {   //payload stays consistent with local login
                userId:user._id, 
                role:user.role
            },
            process.env.JWT_SECRET,
            {expiresIn:"1d"}
        )
        res.redirect(
            `${process.env.FRONTEND_URL}/auth/success?token=${token}`
        );
        //As OAuth is Browser Based, JSON response is useless,
        //thus Frontend reads token from URL, stores it, redirects user internally.
    }
);

//Login
router.post("/login", loginController);

module.exports=router;