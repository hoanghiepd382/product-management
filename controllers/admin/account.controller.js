const configSystem = require("../../config/system");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const md5 = require("md5");

module.exports.index = async (req, res) =>{
    const find = {
        deleted: false
    }
    
    const records = await Account.find(find).select("-password -token");
    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false
        });
        record.role = role;
    }
    res.render("admin/pages/accounts/index", {
        pageTitle: "Danh sách tài khoản",
        records: records
    });
}

module.exports.create = async (req, res) =>{
    const roles = await Role.find({deleted: false});
    res.render("admin/pages/accounts/create", {
        pageTitle: "Thêm tài khoản mới",
        roles: roles
    });
}

module.exports.createPost = async (req, res) =>{
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false
    });
    if (emailExist){
        req.flash("error", `Email ${req.body.email} đã tồn tại!`);
        res.redirect("back");
    }
    else{
        req.body.password = md5(req.body.password);

        const newAccount = await new Account(req.body);
        newAccount.save();
        res.redirect(`${configSystem.prefixAdmin}/account`);
    }

}

module.exports.edit = async (req, res) =>{
    const roles = await Role.find({deleted: false});
    const account = await Account.findOne({
        _id: req.params.id,
        deleted: false
    })
    res.render("admin/pages/accounts/edit", {
        pageTitle: "Chỉnh sửa tài khoản",
        roles: roles,
        data: account
    })
}
module.exports.editPatch = async (req, res) =>{
    const emailExist = await Account.findOne({email: req.body.email, _id: {$ne: req.params.id} });
    if (emailExist){
        req.flash("error", `Email ${req.body.email} đã tồn tại!`);
        res.redirect("back");
    }
    else{
        if (req.body.password){
            req.body.password = md5(req.body.password);
        }
        else{
            delete req.body.password;
        }
        await Account.updateOne({_id: req.params.id}, req.body);
        res.redirect("back");
    }
}