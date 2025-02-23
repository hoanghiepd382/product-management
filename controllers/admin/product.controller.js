const Product = require('../../models/product.model');
const filterStatusHelpers = require('../../helpers/filter-status'); 
const searchHelpers = require('../../helpers/search');
const paginationHelpers = require('../../helpers/pagination');
const pathConfig = require('../../config/system');
module.exports.index = async (req, res)=>{
    const filterButton = filterStatusHelpers(req.query);

    const find = {
        deleted : false
    };

    if (req.query.status){
        find.status = req.query.status;
    }

    objectSearch = searchHelpers(req.query);
    if (objectSearch.regex){
        find.title = objectSearch.regex;
    }

    let objectPagination = {
        currentPage : 1,
        limitPage : 4
    }
    const totalProduct = await Product.countDocuments(find);
    objectPagination = paginationHelpers(totalProduct, objectPagination, req.query);

    const Products = await Product.find(find).skip(objectPagination.skip).limit(objectPagination.limitPage);
    
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

    await Product.updateOne({_id: id}, {status: status});

    req.flash('success', 'Thay đổi trạng thái thành công!!!');

    res.redirect("back");

}
module.exports.changeMulti = async (req, res)=>{
    const status = req.body.type;
    const ids = req.body.ids.split(", ");
    
    switch (status) {
        case "active":
            await Product.updateMany({_id: {$in: ids}}, {status: "active"}); 
            req.flash('success', `Thay đổi trạng thái ${ids.length} sản phẩm thành công!!!`);  
            break;
        case "inactive":
            await Product.updateMany({_id: {$in: ids}}, {status: "inactive"}); 
            req.flash('success', `Thay đổi trạng thái ${ids.length} sản phẩm thành công!!!`);   
            break;
        case "delete-all":
            await Product.updateMany({_id: {$in: ids}}, {deleted: true});
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
            deletedAt: new Date()
        }
    );
    req.flash('success', `Xóa sản phẩm thành công!!!`); 
    res.redirect("back");
}

module.exports.create = (req, res) =>{
    res.render("admin/pages/products/create", {
        pageTitle : "Thêm mới sản phẩm"
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
    if (!req.body.thumbnail){
        if (req.file){
            req.body.thumbnail = `/uploads/${req.file.filename}`;
        }
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
    
        res.render("admin/pages/products/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product
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

    if (!req.body.thumbnail){
        if (req.file){
            req.body.thumbnail = `/uploads/${req.file.filename}`;
        }
        else{
            req.body.thumbnail = "";
        }
    }
    try {
        await Product.updateOne({_id: req.params.id}, req.body);
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
 
    res.render("admin/pages/products/detail", {
        pageTitle: product.title,
        product: product
    });
}