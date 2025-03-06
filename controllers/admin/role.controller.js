const Role = require('../../models/role.model');
const pathConfig = require('../../config/system');

module.exports.index = async (req, res)=>{
    const roles = await Role.find({deleted: false});
    res.render("admin/pages/roles/index", {
        pageTitle : "Danh sách nhóm quyền",
        records : roles
    });
}

module.exports.create = (req, res)=>{
    res.render("admin/pages/roles/create", {
        pageTitle : "Thêm nhóm quyền"
    });
}
module.exports.createPost = async (req, res)=>{

    const role = new Role(req.body);
    await role.save();
    res.redirect(`${pathConfig.prefixAdmin}/role`);
}

module.exports.edit = async (req, res)=>{
    try {
        const data = await Role.findOne({_id: req.params.id});
        res.render("admin/pages/roles/edit", {
            pageTitle : "Chỉnh sửa quyền",
            record : data
        });
    } catch (error) {
        res.redirect(`${pathConfig.prefixAdmin}/role`);
    }
}

module.exports.editPatch = async (req, res)=>{
   try {
    const id  = req.params.id;
    await Role.updateOne({_id: id}, req.body);
    req.flash('success', 'Cập nhật thành công');
   } catch (error) {
    res.send(error);
   }
    res.redirect("back");
      
}
module.exports.permissions = async (req, res)=>{
    const records = await Role.find({deleted: false});
    res.render("admin/pages/roles/permissions", {
        pageTitle : "Phân quyền",
        records: records
    });
}

module.exports.permissionsPath = async (req, res) =>{
    const permissions = JSON.parse(req.body.permissions);

    try {
        for (const item of permissions) {
            await Role.updateOne({_id: item.id}, {permissions: item.permissions});
        }
        req.flash("success", "Cập nhật thành công!")
    } catch (error) {
        req.flash("error", "Cập nhật thất bại!");
    }
    res.redirect("back");
}