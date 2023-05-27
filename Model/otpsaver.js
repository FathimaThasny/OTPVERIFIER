const mongoose = require('mongoose')

const otpSchema = mongoose.Schema({
    otp: String,
    email: String
})

const otpModel = mongoose.model(
    "otpsaver",otpSchema
)

module.exports = {otpModel}