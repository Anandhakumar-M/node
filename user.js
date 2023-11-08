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
  password: {
    type: String,
    required: true
  },
  verificationToken: {
    type: String
  },
  passwordResetToken: {
    type: String
  },
  isEmailConfirmed: {
    type: Boolean,
    default: false
  },
  emailConfirmedAt: {
    type: Date
  },
  roles: {
    type: [String],
    enum: ['user', 'admin'],
    default: ['user']
  }
});


const User = mongoose.model('User', userSchema);

module.exports = User;
