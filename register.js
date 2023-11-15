const express=require("express");
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const nodemailer = require('nodemailer');
const User =require("../model/user")
const UserPermissions = require("../model/userpermissions");
const reg=express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'atreating@gmail.com',
    pass: 'zkzh jbfm cmci frmq'
  }
});

reg.post('/register', async (req, res) => {
    const { name, email, password, role,modules } = req.body;
  
    try {
      // Check if the email is already registered
      const CheckUser = await User.findOne({ email });
      if (CheckUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
  
      // encrypt the password 
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a verification token
      const verificationToken = uuid.v4();
  
      // Create a new user record
      const user = new User({
        name:name,
        email:email,
        password: hashedPassword,
        verificationToken:verificationToken,
        
      });
  
      await user.save();

      const userpermissions = new UserPermissions({
        _id:user,
        name:user.name,
        userId:user,
        role:role,
        module:modules,

      })

      await userpermissions.save();


      //console.log(verificationToken);
  
      // Send a verification email
      await transporter.sendMail({
        to: email,
        subject: 'Verify your email',
        text: `Click this link to verify your email: http://localhost:3333/verify/${verificationToken}`,
        
      });
  
      res.status(201).json({ message: 'Registration successful. Check your email for verification .' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error in verification' });
    }
  
      
});

module.exports=reg;