const User=require("../models/user");
const jwt=require("jsonwebtoken");

async function signupController(req,res) {
    try{
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                error:"All credentials required!",
            })
        }
        const olduser=await User.findOne({email});
        if(olduser){
            return res.status(409).json({
                error:"User already exists",
            })
        }
        const user=await User.create({
            name,
            email,
            password
        });
        return res.status(201).json({
            status:"New user created",
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
            }
        });
    }
    catch(err){
        return res.status(500).json({
            error:`Internal Server Error: ${err}`,
        })
    }
}

async function loginController(req,res){
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({
                error:"Email and Password required!",
            });
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({
                error:"Invalid email or password",
            });
        }
        const ismatch=await user.matchPassword(password);
        if(!ismatch){
            return res.status(401).json({
                error:"Invalid email or password"
            });
        }
        const token=jwt.sign(
            {
                userId:user._id,
                role:user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn:process.env.JWT_EXPIRES_IN || '1d',
            }
        );
        return res.status(200).json({
            message:"Login Successful",
            token,
            user:{
                    id:user._id,
                    name:user.name,
                    email:user.email,
                    role:user.role,
            }
        });
    }
    catch(err){
        return res.status(500).json({
            error:`Internal Server Error: ${err}`,
        })
    }
}

module.exports={signupController,loginController};