module.exports.createRoom =  (req, res, next) =>{
    if (!req.body.title){
        req.flash("error", "Vui lòng nhập tiêu đề");
        res.redirect("back");
        return;
    }
    if (!Array.isArray(req.body.usersId)){
        req.flash("error", "Chọn ít nhất 2 người để tạo phòng");
        res.redirect("back");
        return;
    }
    next();
}