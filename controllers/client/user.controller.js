const User = require("../../models/user.model");
const Cart = require("../../models/cart.model");
const ForgotPassword = require("../../models/forgot-password.model");
const md5 = require("md5");
const generateOTP = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");



module.exports.register = (req, res) =>{
    res.render("client/pages/user/register", {
        pageTitle: "Trang đăng ký tài khoản"
    });
}
module.exports.registerPost = async (req, res) =>{
    const user = await User.findOne({
        email: req.body.email,
        deleted: false
    });
    if (user){
        req.flash("error", "Email đã tồn tại! Vui lòng chọn email khác");
        res.redirect("back");
        return;
    }
    req.body.password = md5(req.body.password);

    const newUser = new User(req.body);
    newUser.save();

    res.cookie("tokenUser", newUser.tokenUser);
    const cart = await Cart.findOne({
        user_id: newUser.id
    });
    if (cart){
        res.cookie("cartId", cart.id);
    }
    else{
        const newCart = new Cart({user_id: newUser.id});
        newCart.save();
        res.cookie("cartId", newCart.id);
    }
    res.redirect("/");
}

module.exports.login = async (req, res) =>{
    res.render("client/pages/user/login", {
        pageTitle: "Trang đăng nhập"
    })
}
module.exports.loginPost = async (req, res) =>{
    res.cookie("oldCartId",req.cookies.cartId );
    const user = await User.findOne({
        email: req.body.email,
        deleted: false
    });
    if (!user){
        req.flash("error", "Email không tồn tại");
        res.redirect("back");
        return;
    }
    if (md5(req.body.password) != user.password){
        req.flash("error", "Mật khẩu không chính xác");
        res.redirect("back");
        return;
    }
    if (user.status == "locked"){
        req.flash("error", "Tài khoản của bạn đang bị khóa");
        res.redirect("back");
        return;
    }
    res.cookie("tokenUser", user.tokenUser);
    const cart = await Cart.findOne({
        user_id: user.id
    });
    if (cart){
        res.cookie("cartId", cart.id);
    }
    else{
        const newCart = new Cart({user_id: user.id});
        newCart.save();
        res.cookie("cartId", newCart.id);
    }
    res.redirect("/");
}

module.exports.logout = (req, res) =>{
    res.clearCookie("tokenUser");
    res.cookie("cartId", req.cookies.oldCartId);
    res.redirect("/user/login");
}

module.exports.forgotPassword = (req, res) =>{
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Quên mật khẩu"
    })
}

module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;

    const user = await User.findOne({
        email: email,
        status: "active",
        deleted: false
    });
    if (!user){
        req.flash("Email không tồn tại hoặc đã bị khóa");
        res.redirect("back");
        return;
    }
    const otp = generateOTP.generateRandomNumber(8);
    const objectForgot = {
        email: email,
        otp : otp,
        expireAt : Date.now()
    }
    const newForgotPasword = new ForgotPassword(objectForgot);
    newForgotPasword.save();

    const subject = "Mã xác thực thay đổi mật khẩu";

    const html = `
                Mã xác thực của bạn là <b>${otp}</b> <br>
                Tuyệt đối không cung cấp mã cho bất kì ai
                 `

    sendMailHelper.sendMail(email, subject, html);
    
    res.redirect(`/user/password/otp?email=${email}`);
}

module.exports.otpPassword = async (req, res) =>{
    const email = req.query.email;
    res.render("client/pages/user/otp-password", {
        pageTitle: "Nhập mã xác thực",
        email: email
    });
}

module.exports.otpPasswordPost = async (req, res) =>{
    const email = req.body.email;
    const otp = req.body.otp;

    const forgotpassword = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });
    if (!forgotpassword){
        req.flash("error", "Mã xác thực không đúng");
        res.redirect("back");
        return;
    }
    const user = await User.findOne({
        email: email
    });
    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/user/password/reset");
}

module.exports.resetPassword = (req, res) =>{
    res.render("client/pages/user/reset-password", {
        pageTitle: "Đặt lại mật khẩu"
    });
}

module.exports.resetPasswordPost = async (req, res) =>{
   
    await User.updateOne(
        {
            tokenUser: req.cookies.tokenUser
        },{
            password: md5(req.body.password)
        });
    req.flash("success", "Đổi mật khẩu thành công!");
    res.redirect("/");
}
