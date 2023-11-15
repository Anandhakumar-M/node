const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  verificationToken: String,
  isEmailConfirmed: {
    type: Boolean,
    default: false
  },
  emailConfirmedAt: Date,
  password: {
    type: String,
    required: true
  },
  passwordResetToken: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
