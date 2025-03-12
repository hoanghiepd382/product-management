const mongoose = require("mongoose");
const generateHepler = require("../helpers/generate");

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    phone: String,
    avatar: String,
    deleted: {
        type: Boolean,
        default: false
    },
    deleteAt: Date,
    status: {
        type: String,
        default: "active"
    },
    tokenUser: {
        type: String,
        default: generateHepler.generateRandomString(20) 
}
},
{
    timestamps: true
})

const User = mongoose.model("User", userSchema, "users");
module.exports = User;