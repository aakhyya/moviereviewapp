const passport=require("passport"); //Passport Engine
const GoogleStrategy=require("passport-google-oauth20").Strategy; //OAuth 2.0 based authentication startegy
const User=require("../models/user");
const Audit=require("../models/auditlog");
console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID)


passport.use(
    
    new GoogleStrategy( //creating instance of Google Strategy
        {
            clientID:process.env.GOOGLE_CLIENT_ID, //tells google who's asking
            clientSecret:process.env.GOOGLE_CLIENT_SECRET, //verifies request is from our backend
            callbackURL:"/api/auth/google/callback", //redirects to this page after verification
        },
        

        //access token, refresh token, Google's user info, tells passport verification done
        async(_, __, profile,done)=>{ 
            const email=profile.emails[0].value; //verifies account is valid
            let user=await User.findOne({email}); //if this email already exists, this person is that user.
            if(!user){ //first time seeing this person
                user=await User.create({
                    name:profile.displayName,
                    email,
                    googleId:profile.id, //unique Google identifier
                    authProvider:"google",
                    role:"viewer",
                });
            }
            await Audit.create({ //logging in Audit
                actor: user._id,
                action: "USER_SIGNUP_GOOGLE",
                entityType: "User",
                entityId: user._id,
                metadata: {
                    authProvider: "google",
                    email: user.email,
                },
            });

            return done(null,user); //Passport exit poitn, authn successful. Attach this user to req.user.
        }
    )
);

module.exports=passport;