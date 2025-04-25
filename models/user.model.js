const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

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
    googleId: String,
    facebookId: String,
    tokenUser: {
        type: String,
        default: null
    }
},
{
    timestamps: true
});

userSchema.methods.generateToken = function () {
    return jwt.sign(
        { id: this._id, email: this.email },
        process.env.JWT_SECRET,
        { expiresIn: '1d' } 
    );
};
userSchema.post('save', async function (doc) {
    if (!doc.tokenUser) {
        doc.tokenUser = doc.generateToken();
        await doc.save();
    }
});

const User = mongoose.model("User", userSchema, "users");
module.exports = User;