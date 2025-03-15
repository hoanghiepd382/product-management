const Product = require('../../models/product.model');
const ProductCategory = require('../../models/product-category.model');
const Account = require("../../models/account.model");
const filterStatusHelpers = require('../../helpers/filter-status'); 
const searchHelpers = require('../../helpers/search');
const paginationHelpers = require('../../helpers/pagination');
const pathConfig = require('../../config/system');
const createTreeHelper = require('../../helpers/create-tree');


module.exports.index = async (req, res)=>{
    const filterButton = filterStatusHelpers(req.query);

    const find = {
        deleted : false
    };

    if (req.query.status){
        find.status = req.query.status;
    }

    const objectSearch = searchHelpers(req.query);
    if (objectSearch.regex){
        find.title = objectSearch.regex;
    }

    let objectPagination = {
        currentPage : 1,
        limitPage : 4
    }

    const sort = {};
    if (req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue;
    }
    else{
        sort.position = "desc";
    }
    const totalProduct = await Product.countDocuments(find);
    objectPagination = paginationHelpers(totalProduct, objectPagination, req.query);

    const Products = await Product.find(find)
    .sort(sort)
    .skip(objectPagination.skip)
    .limit(objectPagination.limitPage);
    
    for (const item of Products) {
        const account = await Account.findOne({
            _id: item.createdBy.account_id,
            deleted: false
        });
        if (account){
            item.accountFullName= account.fullName;
        }
        const updatedBy = item.updatedBy.slice(-1)[0];
        if (updatedBy){
        const userUpdated = await Account.findOne({
            _id: updatedBy.account_id,
            deleted: false
        });
        updatedBy.fullName = userUpdated.fullName;
    }
}

    res.render("admin/pages/products/index", {
        pageTitle : "Danh sách sản phẩm",
        products : Products,
        filterButton : filterButton,
        keyword : objectSearch.keyword,
        objectPagination : objectPagination
    });
}

module.exports.changeStatus = async (req, res)=>{
    const status = req.params.status;
    const id = req.params.id;

    const updated = {
        account_id: res.locals.user.id,
        updateAt: new Date()
    };

    await Product.updateOne({_id: id}, 
        {
            status: status,
            $push : {updatedBy : updated}
        });

    req.flash('success', 'Thay đổi trạng thái thành công!!!');

    res.redirect("back");

}
module.exports.changeMulti = async (req, res)=>{
    const status = req.body.type;
    const ids = req.body.ids.split(", ");
    const updated = {
        account_id : res.locals.user.id,
        updateAt : new Date()
    };
    
    switch (status) {
        case "active":
            await Product.updateMany({_id: {$in: ids}}, 
            {status: "active", $push: {updatedBy: updated}}); 
            req.flash('success', `Thay đổi trạng thái ${ids.length} sản phẩm thành công!!!`);  
            break;
        case "inactive":
            await Product.updateMany({_id: {$in: ids}}, {status: "inactive", $push: {updatedBy: updated}}); 
            req.flash('success', `Thay đổi trạng thái ${ids.length} sản phẩm thành công!!!`);   
            break;
        case "delete-all":
            await Product.updateMany({_id: {$in: ids}}, {
                deleted: true,
                deletedBy : {
                    account_id: res.local.user.id,
                    deleteAt: new Date()
                }
            });
            req.flash('success', `Xóa ${ids.length} sản phẩm thành công!!!`);    
            break;
        case "change-position":
            for (const item of ids) {
                const [id, position] = item.split("-");
                await Product.updateOne({_id: id}, {position: position});
            }
            req.flash('success', `Thay đổi vị trí ${ids.length} sản phẩm thành công!!!`); 
            break;
        default:
            break;

    }

    res.redirect("back");
}

module.exports.deleteProduct = async (req, res)=>{
    const id = req.params.id;
    await Product.updateOne({_id: id}, 
        {
            deleted: true,
            deletedBy :{
                account_id: res.locals.user.id,
                deleteAt: new Date()
            }
        }
    );
    req.flash('success', `Xóa sản phẩm thành công`); 
    res.redirect("back");
}

module.exports.create = async (req, res) =>{
    const find = {
        deleted: false
    }
    
    const records = await ProductCategory.find(find);
    const newRecords = createTreeHelper.createTree(records);
    res.render("admin/pages/products/create", {
        pageTitle : "Thêm mới sản phẩm",
        records: newRecords
    });
}

module.exports.createPost = async (req, res) =>{
    req.body.price = parseInt(req.body.price);;
    req.body.discountPrecentage = parseInt(req.body.discountPrecentage);
    req.body.stock = parseInt(req.body.stock);


    if (!req.body.position) {
        const count = await Product.countDocuments();
        req.body.position = count + 1;
    }
    req.body.createdBy = {
        account_id : res.locals.user.id
    }
    const newProduct = new Product(req.body);
    newProduct.save();
    
    res.redirect(`${pathConfig.prefixAdmin}/product`);
}

module.exports.edit = async (req, res) =>{
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const product = await Product.findOne(find);
        const records = await ProductCategory.find({deleted: false});
        const newRecords = createTreeHelper.createTree(records);
        res.render("admin/pages/products/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product,
            records: newRecords
        });
    } catch (error) {
        res.redirect(`${pathConfig.prefixAdmin}/product`);
    }
}

module.exports.editPost = async (req, res) =>{
    req.body.stock = parseInt(req.body.stock);
    req.body.price = parseInt(req.body.price);
    req.body.discountPrecentage = parseFloat(req.body.discountPrecentage);
    req.body.position = parseInt(req.body.position);

    try {
        const updated = {
            account_id: res.locals.user.id,
            updateAt: new Date()
        };
        await Product.updateOne({_id: req.params.id},
            {
                ...req.body,
                $push: {updatedBy: updated}
            });
             
        req.flash("success", "Cập nhật thành công")
       
    } catch (error) {
        res.redirect(`${pathConfig.prefixAdmin}/product`);
    }
    res.redirect("back");
}

module.exports.detail = async (req, res) =>{
    const find = {
        deleted: false,
        _id: req.params.id
    };
    const product = await Product.findOne(find);
    if (product.product_category_id){
        var productCategory = await ProductCategory.findOne({_id: product.product_category_id});
    }
    res.render("admin/pages/products/detail", {
        pageTitle: product.title,
        product: product,
        category: productCategory
    });
}
