const express=require("express");
const rt=express.Router();
const User =require("../model/user");


//*************************   VERIFY TOKEN  *********************/
rt.get('/verify/:token', async (req, res) => {
    const verificationToken = req.params.token;
    
  
    try {
      const user = await User.findOne({ verificationToken });
      if (!user) {
        return res.status(400).json({ message: 'Invalid verification token' });
      }
  
      user.isEmailConfirmed = true;
      user.emailConfirmedAt = new Date();
      user.verificationToken = undefined;
  
      await user.save();
  
      res.json({ message: 'Email verification successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  module.exports=rt;