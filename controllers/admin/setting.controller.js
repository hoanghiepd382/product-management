const SettingGeneral = require("../../models/settings-general.model");

module.exports.general = async (req, res)=> {
    const setting = await SettingGeneral.findOne();
    res.render("admin/pages/setting/general", {
        pageTitle: "Cài đặt chung",
        setting: setting
    });
}

module.exports.patchGeneral = async (req, res)=>{
    const setting = await SettingGeneral.findOne();
    if (!setting){
        const newSetting = new SettingGeneral(req.body);
        newSetting.save();
    }
    else{
        await SettingGeneral.updateOne({
            _id: setting.id
        },req.body);
    }
    res.redirect("back")
}