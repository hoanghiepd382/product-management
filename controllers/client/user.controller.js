const User = require("../../models/user.model");
const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");
const Review = require("../../models/review.model");
const ForgotPassword = require("../../models/forgot-password.model");
const md5 = require("md5");
const generateOTP = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");
const passport = require("passport");
const newPriceProductHelper = require("../../helpers/newPriceProduct");



module.exports.register = (req, res) =>{
    res.render("client/pages/user/register", {
        pageTitle: "Đăng ký tài khoản"
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
        pageTitle: "Đăng nhập"
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
    
    user.tokenUser = user.generateToken();
    await user.save();
    res.cookie('tokenUser', user.tokenUser, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, 
      });

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
    await User.updateOne({
        tokenUser: user.tokenUser
    },{
        statusOnline: "online"
    });
    _io.once("connection", (socket)=>{
        socket.broadcast.emit("SERVER_RETURN_STATUS_ONLINE", user.id)
    })
    res.redirect("/");
}

module.exports.callbackGoogle = async (req, res) => {
    try {
        res.cookie("oldCartId", req.cookies.cartId );
        const user = req.user;
        user.tokenUser = user.generateToken();
        await user.save();

        res.cookie('tokenUser', user.tokenUser, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, 
        });
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
        res.redirect('/');
    } catch (err) {
        console.error('Lỗi callback Google:', err);
        res.render('client/pages/user/login', {
            error: 'Có lỗi xảy ra khi đăng nhập bằng Google',
            pageTitle: 'Đăng nhập'
        });
    } 
}

module.exports.callbackFacebook = async (req, res)=>{
    try {
        res.cookie("oldCartId", req.cookies.cartId );
        const user = req.user;
        user.tokenUser = user.generateToken();
        await user.save();

        res.cookie('tokenUser', user.tokenUser, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, 
        });
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
        res.redirect('/');
    } catch (err) {
        console.error('Lỗi callback Facebook:', err);
        res.render('client/pages/user/login', {
            error: 'Có lỗi xảy ra khi đăng nhập bằng Facebook',
            pageTitle: 'Đăng nhập'
        });
    } 
}
module.exports.logout = async (req, res) =>{
    await User.updateOne({
        tokenUser: req.cookies.tokenUser
    },{
        statusOnline: "offline"
    })
    res.clearCookie("tokenUser");
    res.cookie("cartId", req.cookies.oldCartId);

    _io.once("connection", (socket)=>{
        socket.broadcast.emit("SERVER_RETURN_STATUS_OFFLINE", res.locals.user.id);
    })

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

module.exports.info = async (req, res) =>{
    const user = await User.findOne({
        tokenUser : req.cookies.tokenUser
    }).select("-password");
    res.render("client/pages/user/info", {
        pageTitle: "Thông tin cá nhân",
        user : user
    });
}

module.exports.infoPatch = async (req, res) =>{
    const user = await User.findOne({
        tokenUser: req.cookies.tokenUser
    });
    const existEmail = await User.findOne({
        email: req.body.email,
        _id : {$ne: user.id}
    });
    if (existEmail){
        req.flash("error", "Email đã tồn tại, vui lòng chọn email khác");
        res.redirect("back");
        return;
    }
    await User.updateOne({_id: user.id}, req.body);
    req.flash("success", "Cập nhật thành công");
    res.redirect("back");
}

module.exports.historyOrder = async (req, res) =>{
    try {
        const user = await User.findOne({
            tokenUser: req.cookies.tokenUser
        });
        const order = await Order.findOne({
            userId: user.id
        });
        if (order){
            for (const product of order.products) {
                const productInfo = await Product.findOne({
                    _id: product.product_id,
                    deleted: false
                });
                newPriceProductHelper.newPriceDetailProduct(productInfo);
                product.infoProduct = productInfo;
                product.totalPrice = productInfo.newPrice * product.quantity;
            }
            res.render("client/pages/user/history-order", {
                pageTitle: "Lịch sử mua hàng",
                order: order
            })
        }
    } catch (error) {
        
    }
}