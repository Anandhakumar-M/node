const express=require("express");
const log=express.Router();
const User =require("../model/user");
const UserPermissions = require("../model/userpermissions");
const bcrypt = require('bcrypt');
const generateToken = require("../middleware/generatetoken");


log.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      
  
      if (!user) {
        return res.status(401).json({ message: 'Invalid email ' });
      }
  
      // Check if the provided password matches the stored password
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid  password' });
      }

      //Check if the mail is verified
      const verifed = await {where :user.isEmailConfirmed,raw:true};
      console.log(verifed.where);
      if (!verifed.where==true) {
        return res.status(404).json("please confirm your email and again loging")
      }
      const permission = await UserPermissions.findOne(user._id);
      console.log(permission);
        if (permission.role=="admin") {
          permission.permissions.read = true,
          permission.permissions.write = true,
          permission.permissions.delete = true,
          permission.permissions.update = true
        }else if (permission.role=="doctor") {
          permission.permissions.read = true,
          permission.permissions.write = true,
          permission.permissions.delete = false,
          permission.permissions.update = false
        }else if (permission.role=="manager") {
          permission.permissions.read = true,
          permission.permissions.write = true,
          permission.permissions.delete = false,
          permission.permissions.update = false
        }else if (permission.role=="user") {
          permission.permissions.read = true,
          permission.permissions.write = true,
          permission.permissions.delete = false,
          permission.permissions.update = false
        }
        await permission.save();
  
        
      const token = generateToken(user);
      res.status(200).json({token});    
    
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

module.exports=log;