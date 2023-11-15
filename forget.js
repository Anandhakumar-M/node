const express = require("express");
const User = require("../model/user");
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const uuid = require('uuid');
const reset=express.Router();


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'atreating@gmail.com',
      pass: 'zkzh jbfm cmci frmq'
    }
  });

//********************** FORGET PASSWORD ****************************/



reset.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Generate a unique token for password reset
      const resetToken = uuid.v4();
  
      user.passwordResetToken = resetToken;
      user.passwordResetTokenExpiration = new Date(Date.now() + 3600000); 
  
      await user.save();
  
      // Send the password reset email
      await transporter.sendMail({
        to: email,
        subject: 'Password Reset',
        text: `Click this link to reset your password:  http://localhost:3333/reset-password/${resetToken}`,
      });
  
      res.json({ message: 'Password reset instructions sent to your email' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  
  /////**********************RESET PASSWORD *******************/
  
  
  
  
  reset.post('/reset-password/:passwordResetToken', async (req, res) => {
    const { newpassword } = req.body;
    const passwordResetToken = req.params.passwordResetToken;
    console.log(passwordResetToken);
  
    try {
      // Find the user 
      const user = await User.findOne( {passwordResetToken} );
      console.log(user);
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired password reset token' });
      }
  
      if (user.passwordResetTokenExpiration < new Date()) {
        return res.status(400).json({ message: 'Password reset token has expired' });
      }
  
      // Hash the new password
      console.log(newpassword);
      const hashedPassword = await bcrypt.hash(newpassword, 10);
  
      // Update 
      user.password = hashedPassword;
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpiration = undefined;
  
      await user.save();
  
      res.json({ message: 'Password reset successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  module.exports=reset;