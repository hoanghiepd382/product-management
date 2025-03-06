const ProductCategory = require("../../models/product-category.model");
const creatTreeHelper = require("../../helpers/create-tree");
const pathConfig = require("../../config/system");

module.exports.index = async (req, res)=>{
    const find = {
        deleted: false
    }
    
    const productCategories = await ProductCategory.find(find);
    const newRecords = creatTreeHelper.createTree(productCategories);
    res.render("admin/pages/product-category/index", {
        pageTitle : "Danh sách danh mục sản phẩm",
        records: newRecords
    });
}

module.exports.create = async (req, res)=>{
    const find ={
        deleted: false
    }
    const records = await ProductCategory.find(find);
    const newRecords = creatTreeHelper.createTree(records);

    res.render("admin/pages/product-category/create", {
        pageTitle : "Thêm danh mục sản phẩm",
        records: newRecords
    });
}
module.exports.postCreate = async (req, res)=>{
    if (req.body.position) {
        req.body.position = parseInt(req.body.position);
    } else {
        req.body.position = await ProductCategory.countDocuments({ deleted: false }) + 1;
    }
    const newProductCategory = new ProductCategory(req.body);
    newProductCategory.save();
    res.redirect(`${pathConfig.prefixAdmin}/product-category`);
}

module.exports.edit = async (req, res)=>{
    try {
        const id = req.params.id;
    const find = {
        deleted: false
    }
    const records = await ProductCategory.find(find);
    const data = await ProductCategory.findOne({_id: id}, find);
    res.render("admin/pages/product-category/edit", {
        pageTitle : "Sửa danh mục sản phẩm",
        data: data,
        records: records
    });
    } catch (error) {
        res.redirect(`${pathConfig.prefixAdmin}/product-category`);
    }
}

module.exports.patchEdit = async (req, res)=>{
   try {
    const id = req.params.id;
    req.position = parseInt(req.body.position);

    await ProductCategory.updateOne({_id: id}, req.body);
    req.flash('success', 'Cập nhật thành công');
    res.redirect("back");
   } catch (error) {
        res.redirect(`${pathConfig.prefixAdmin}/product-category`);
   }
}