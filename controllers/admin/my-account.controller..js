const Account = require("../../models/account.model");
const md5 = require("md5");



module.exports.index = (req, res) =>{
    res.render("admin/pages/my-account/index", {
        pageTitle: "Thông tin cá nhân"
    })
}
module.exports.edit = (req, res) =>{
    res.render("admin/pages/my-account/edit", {
        pageTitle: "Chỉnh sửa thông tin cá nhân"
    });
}
module.exports.editPatch = async (req, res) =>{
    const id = res.locals.user.id;
    console.log(req.body);
    const emailExist = await Account.findOne({
        email: req.body.email,
         _id: {$ne: id} 
        });
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
        await Account.updateOne({_id: id}, req.body);
        res.redirect("back");
    }
}