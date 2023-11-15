const express = require("express");
const lv=express.Router();
const verifyToken =require("../middleware/indexs");


lv.get('/data',verifyToken,(req,res)=>{
    const val=req.user.email;
    res.status(200).json({'welcome':val})
})

module.exports=lv;

