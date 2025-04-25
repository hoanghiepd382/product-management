const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingGeneralSchema = new Schema ({
    websiteName: String,
    logo: String,
    phone: String,
    email: String,
    address: String,
    copyright: String,
    facebook: String,
    zalo: String,
    tiktok: String
},
{
    timestamps: true,
}
);

const SettingGeneral = mongoose.model('SettingGeneral', settingGeneralSchema, 'settings-general');
module.exports = SettingGeneral;