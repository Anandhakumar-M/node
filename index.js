const bodyParser = require('body-parser');
const express = require("express");
const mongoose = require("mongoose");
const reg=require("./router/register");
const rt=require("./router/registerverification");
const log=require("./router/login");
const reset=require("./router/forget");
const lv=require("./router/loginverify");
const { configDotenv } = require('dotenv');
require('dotenv').config();


const app = express();


app.use(express.json());

// connet mongodb 
mongoose.connect('mongodb://localhost/farm-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(bodyParser.json());



app.use("/user/",reg,rt,log,lv,reset);


app.listen(3333, () => {
    console.log('server is runing port = 3333')
})