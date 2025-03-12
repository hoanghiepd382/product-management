module.exports.register = (req, res, next)=>{
    if (!req.body.fullName){
        req.flash("error", "Vui lòng nhập họ tên!");
        res.redirect("back");
        return;
    }
    if (!req.body.email){
        req.flash("error", "Vui lòng nhập Email!");
        res.redirect("back");
        return;
    }
    if (!req.body.password){
        req.flash("error", "Vui lòng nhập mật khẩu!");
        res.redirect("back");
        return;
    }
    next();
}

module.exports.login = (req, res, next) =>{
    if (!req.body.email){
        req.flash("error", "Vui lòng nhập Email!");
        res.redirect("back");
        return;
    }
    if (!req.body.password){
        req.flash("error", "Vui lòng nhập mật khẩu!");
        res.redirect("back");
        return;
    }
    next();
}

module.exports.resetPassword = (req, res, next) =>{
    if (!req.body.password){
        req.flash("error", "Vui lòng nhập mật khẩu mới!");
        res.redirect("back");
        return;
    }
    if (!req.body.repeat_password){
        req.flash("error", "Vui lòng nhập lại mật khẩu mới!");
        res.redirect("back");
        return;
    }
    if (req.body.password != req.body.repeat_password){
        req.flash("error", "Mật khẩu xác nhận không khớp");
        res.redirect("back");
        return;
    }
    next();
}