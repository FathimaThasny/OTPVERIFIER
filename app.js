const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const nodemailer = require("nodemailer")
const {customOtpGen} = require('otp-gen-agent')
const path = require('path')

const { otpModel } = require('./Model/otpsaver.js')

const app = express()

const pathtobuild = path.join(__dirname+ '/build')

app.use(express.static(pathtobuild))
console.log("first")
console.log(pathtobuild)


app.use(cors())
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

require('./db/connection.js') //database connection




//----------------api for otp sending--------------------
app.post('/api/sendotp', async(req,res)=>{
    console.log(req.body)
    const mail= req.body.email


    
    //----------function for generating otp---------
const otp = await customOtpGen({length: 6});

let item = {
    "email": mail,
    "otp" : otp
}

//-----saving to db----
let data = new otpModel(item)
    data.save()

    console.log("mail")
    console.log(mail)
    sendEmail(
        mail,
        otp
 );
 res.json({status : 'Email Send'})  
})

//----------------mail using nodemailer------------------
const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "vaisakh1996v@gmail.com",

      pass: "ltdzknwggigvpdvd"
    },
  });
  const sendEmail = (mail,otp) => {
    console.log("Check");
    console.log(mail)
    transport.sendMail({
      from: "fathimathasny4@gmail.com",
      to: mail,
      subject: "One Time Password(OTP) for Verification",
      html: `<h2>Hello </h2>
          <p>Following is your One Time Password for email Verification</p>
          <p>${otp}</p>
          </div>`,
    }).catch(err => console.log(err));
  };


  app.post('/api/checkotp', async(req,res)=>{
    let data = await otpModel.findOne(req.body)
    if((!data)){
      res.json({msg: "Invalid Input"})  
  }else{
    res.json({msg:'OTP Verified'})
  }
  })


app.listen(3906,()=>{
    console.log("Server Running at 3906")
})


app.get('*',(req,res)=>{
    const pathindex = path.join(pathtobuild + '/index.html')
    res.sendFile(pathindex)
})

