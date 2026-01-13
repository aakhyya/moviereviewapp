const jwt=require("jsonwebtoken");

function requireAuth(req,res,next) {
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            error:"Authorization Token missing",
        })
    }
    const token=authHeader.split(" ")[1];
    try{
        const decodeduser=jwt.verify(token,process.env.JWT_SECRET);
        req.user={
            id:decodeduser.userId,
            role:decodeduser.role,
        }
        next();
    }
    catch(err){
        return res.status(401).json({
            error: "Invalid or expired token",
        });
    }
}

module.exports=requireAuth;