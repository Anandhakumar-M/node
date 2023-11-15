const jwt = require("jsonwebtoken");
const generateToken = (user) => jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '60m' });

module.exports=generateToken;