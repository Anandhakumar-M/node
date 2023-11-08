const bodyParser = require('body-parser');
const User = require('./model/user');
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const uuid = require('uuid');

const app = express();
const port = 3333;

app.use(express.json());

// connet mongodb 
mongoose.connect('mongodb://localhost/management-user', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(bodyParser.json());


// **********************   NODEMAILER    ****************

const transporter = nodemailer.createTransport({
    service:'example:gmaile',
    auth:{
      user: 'example@gmail.com',
      pass: 'zkzh fefg cmci sfsf'
    }
  });

// **********************   REGISTER     ****************


app.post('/register', async (req, res) => {
  const { name, email, password, roles } = req.body;

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
      roles:roles,
      verificationToken:verificationToken,
      
    });

    await user.save();
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
//*************************   VERIFY TOKEN  *********************/
app.get('/verify/:token', async (req, res) => {
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


// *****************     LOGIN    ***************



app.post('/login', async (req, res) => {
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
    res.status(200).json({user})    
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

//********************** FORGET PASSWORD ****************************/



app.post('/forgot-password', async (req, res) => {
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

    res.json({ message: 'Reset Password request was sent to your email ' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


/////**********************RESET PASSWORD *******************/




app.post('/reset-password/:passwordResetToken', async (req, res) => {
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

app.listen(3333, () => {
    console.log('server is runing port = 3333')
})