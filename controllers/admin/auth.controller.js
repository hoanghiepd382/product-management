const Account = require("../../models/account.model");
const pathConfig = require("../../config/system");
const md5 = require("md5");


module.exports.login = (req, res) =>{
    if (!req.cookies.token){
        res.render("admin/pages/auth/login.pug");
    }
    else{
        res.redirect(`${pathConfig.prefixAdmin}/dashboard`);
    }
}

module.exports.loginPost = async (req, res) =>{
    const email = req.body.email;
    const password = req.body.password;
    
    const User = await Account.findOne({
        email: email,
        deleted: false
    });
    if (!User){
        req.flash("error", "Email không tồn tại!");
        res.redirect("back");
        return;
    }
    if (md5(password) != User.password){
        req.flash("error", "Mật khẩu không chính xác!");
        res.redirect("back");
        return;
    }
    if (User.status == "inactive"){
        req.flash("error", "Tài khoản đã bị ngừng hoạt động!");
        res.redirect("back");
        return;
    }
    res.cookie("token", User.token);
    res.redirect(`${pathConfig.prefixAdmin}/dashboard`);
}

module.exports.logout = (req, res) =>{
    res.clearCookie("token");
    res.redirect(`${pathConfig.prefixAdmin}/auth/login`);
}