const mongoose = require("mongoose");
const generateHepler = require("../helpers/generate");

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    phone: String,
    avatar: String,
    address: String,
    birth: Date,
    deleted: {
        type: Boolean,
        default: false
    },
    deleteAt: Date,
    requestList: Array,
    acceptList: Array,
    friendList : [
        {
            user_id: String,
            room_chat_id: String
        }
    ],
    status: {
        type: String,
        default: "active"
    },
    statusOnline : String,
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