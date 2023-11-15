const jwt = require("jsonwebtoken");
const User = require("../model/user");


const verifyToken =(req,res,next)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader){
        res.status(404).json({message:"missing token"});
    }
    const token = authHeader.split(" ")[1];

    jwt.verify(token,process.env.SECRET_KEY,async(err,decode)=>{
        if(err){
            return res.status(404).json("invalid token");
        }
        const user = await User.findOne({_id:decode.userId})
        if(!user){
            res.status(404).json("user not found")
        }
        console.log(user);
        req.user=user;
        next();
    });
};

module.exports = verifyToken;