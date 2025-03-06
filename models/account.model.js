const mongoose = require("mongoose");
const generateHepler = require("../helpers/generate");

const accountSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    phone: String,
    avatar: String,
    role_id: String,
    deleted: {
        type: Boolean,
        default: false
    },
    deleteAt: Date,
    status: String,
    token: {
        type: String,
        default: generateHepler.generateRandomString(20) 
}
},
{
    timestamps: true
})

const Account = mongoose.model("Account", accountSchema, "accounts");
module.exports = Account;