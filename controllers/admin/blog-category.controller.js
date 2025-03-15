const BlogCategory = require("../../models/blog-category.model");
const createTreeHelper = require("../../helpers/create-tree");
const prefixConfig = require("../../config/system");


module.exports.index = async (req, res) =>{
    const blogCategory = await BlogCategory.find({deleted: false});
    const blogCategoryTree = createTreeHelper.createTree(blogCategory);

    res.render("admin/pages/blog-category/index", {
        pageTitle: "Danh mục bài viết",
        records: blogCategoryTree
    });
}

module.exports.create = async (req, res) =>{
    const blogCategory = await BlogCategory.find({deleted: false});
    const blogCategoryTree = createTreeHelper.createTree(blogCategory);

    res.render("admin/pages/blog-category/create", {
        pageTitle: "Tạo danh mục bài viết",
        records: blogCategoryTree
    });
}

module.exports.createPost = async (req, res) =>{
    if (!req.body.position){
        req.body.position = await BlogCategory.countDocuments({ deleted: false }) + 1;
    }
    const newBlogCategory = new BlogCategory(req.body);
    await newBlogCategory.save();

    res.redirect(`${prefixConfig.prefixAdmin}/blog-category`);
}

module.exports.detail = async (req, res) =>{
    res.send("OK");
}