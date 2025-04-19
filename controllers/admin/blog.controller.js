const Blog = require("../../models/blog.model");
const blogCategory = require("../../models/blog-category.model");
const Account = require("../../models/account.model");
const prefixConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/create-tree");


module.exports.index = async (req, res) =>{
    const blog = await Blog.find({
        deleted: false
    });
    res.render("admin/pages/blogs/index", {
        pageTitle: "Trang bài viết",
        blog: blog
    })
}

module.exports.create = async (req, res) =>{
    const blogCategorys = await blogCategory.find({
        deleted: false,
        status: "display"
    });
    const treeBlogCategory = createTreeHelper.createTree(blogCategorys);
    res.render("admin/pages/blogs/create", {
        pageTitle: "Tạo bài viết mới",
        records: treeBlogCategory
    })
}

module.exports.createPost = async (req, res) =>{
    if (!req.body.position){
        const position = await Blog.countDocuments();
        req.body.position = position + 1;
    }
    req.body.writedBy = {
        account_id: res.locals.user.id
    }
    const newBlog = new Blog(req.body);
    await newBlog.save();
    req.flash("success", "Tạo bài viết thành công");
    res.redirect(`${prefixConfig.prefixAdmin}/blog`);
}

module.exports.detail = async (req, res) =>{
    try {
        const blog = await Blog.findOne({
            _id: req.params.id
        });
        const user = await Account.findOne({
            _id: blog.writedBy.account_id
        });
        const lastUpdated = blog.updatedBy.slice(-1)[0];
        const userUpdatedLast = await Account.findOne({
            _id: lastUpdated.account_id
        });
        lastUpdated.fullName = userUpdatedLast.fullName;
        
        res.render("admin/pages/blogs/detail", {
            pageTitle: "Chi tiết bài viết",
            blog: blog,
            userWrited: user
        });
    } catch (error) {
        req.flash("error", "Không thể truy cập bài viết");
        res.redirect("back");
    }
}

module.exports.edit = async (req, res)=>{
    const blog = await Blog.findOne({
        _id: req.params.id
    });
    res.render("admin/pages/blogs/edit", {
        pageTitle: "Chỉnh sửa bài viết",
        blog: blog
    })
}

module.exports.editPatch = async (req, res)=>{
   try {
    const blog = await Blog.findOne({
        _id: req.params.id
    });
    const updated = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    };
    await blog.updateOne({
        ...req.body,
        $push: {updatedBy : updated}
    });
    req.flash("success", "Cập nhật thành công");
    res.redirect("back");
   } catch (error) {
    req.flash("error", "Đã có lỗi xảy ra, vui lòng thử lại");
    res.redirect(`${prefixConfig.prefixAdmin}/blog`);
   }
}

module.exports.delete = async (req, res)=>{
    try {
        const blog = await Blog.findOne({
            _id: req.params.id
        });
        await blog.updateOne({
            deleted: true,
            deletedBy :{
                account_id: res.locals.user.id,
                deletedAt: new Date()
            }
        });
        req.flash("success", "Xóa sản phẩm thành công");
        res.redirect("back");
    } catch (error) {
        req.flash("error", "Đã có lỗi xảy ra, vui lòng thử lại");
        res.redirect("back");
    }
}

module.exports.status = async (req, res) =>{
   try {
    const blog = await Blog.findOne({
        _id: req.params.id
    });
    const updated = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    };
    if (req.params.status == "display"){
        await Blog.updateOne({
            status: "hidden",
            $push: {updatedBy : updated}
        });
    }
    else{
        await Blog.updateOne({
            status: "display",
            $push: {updatedBy : updated}
    });
    }
    req.flash("success", "Cập nhật trạng thái thành công");
   } catch (error) {
    req.flash("error", "Đã có lỗi xảy ra, vui lòng thử lại");
   }
   res.redirect("back");
}