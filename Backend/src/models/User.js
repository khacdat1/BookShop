const mongoose = require('mongoose')
const { Schema, model } = mongoose;

const User = new Schema({
    id: { type: Number, uinque: true },
    avatar: { type: String },
    username: {
        type: String,
        require: true,
    },
    phoneNumber: { type: String },
    email: { type: String, },
    password: { type: String, require: true },
    roleID: {
        type: String
    },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
}, { timestamps: true, })

module.exports = mongoose.model('User', User);


