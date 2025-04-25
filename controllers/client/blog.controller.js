const Blog = require("../../models/blog.model");
const blogCategory = require("../../models/blog-category.model");
const Product = require("../../models/product.model");
const paginationHelpers = require("../../helpers/pagination");


module.exports.index = async (req, res) =>{
    let objectPagination = {
        currentPage : 1,
        limitPage : 6
    }
    const totalBlog = await Blog.countDocuments({deleted: false});
    objectPagination = paginationHelpers(totalBlog, objectPagination, req.query);

    const sort = {
        createdAt : "desc"
    }
    const blog = await Blog.find({
        deleted: false,
        status: "display"
    }).sort(sort)
    .skip(objectPagination.skip)
    .limit(objectPagination.limitPage);

    const BlogCategory = await blogCategory.find({
        deleted: false,
        status: "display"
    });
   
    const product = await Product.find({
        deleted: false,
        status: "active",
        featured: "1"
    }).limit(3);
    res.render("client/pages/blog/index", {
        pageTitle: "Bài viết",
        blogs: blog,
        allBlogs: blog,
        blogCategory: BlogCategory,
        productRecommend: product,
        objectPagination: objectPagination
    });
}

module.exports.topics = async (req, res) =>{
    const slugTopic = req.params.slugTopic;
    const category = await blogCategory.findOne({
        deleted: false,
        status: "display",
        slug: slugTopic
    });
    const allBlog = await Blog.find({
        deleted: false,
        status: "display"
    }).sort({createdAt : "desc"});

    const blogs = await Blog.find({
        deleted: false,
        status: "display",
        blog_category_id: category._id
    });
    const BlogCategory = await blogCategory.find({
        deleted: false,
        status: "display"
    });
    const product = await Product.find({
        deleted: false,
        status: "active",
        featured: "1"
    }).limit(3);
    res.render("client/pages/blog/index", {
        pageTitle: category.title,
        blogs: blogs,
        allBlogs: allBlog,
        blogCategory: BlogCategory,
        productRecommend: product,
        activeCategory: category.title      
    });
}

module.exports.detail = async (req, res)=>{
    const slugBlog = req.params.slugBlog;
    const blog = await Blog.findOne({
        slug: slugBlog
    });
    const newViews = blog.views + 1;
    await Blog.updateOne({
        slug: slugBlog
    },{
        views: newViews
    });
    
    const category = await blogCategory.findOne({
        _id: blog.blog_category_id,
        deleted: false,
        status: "display"
    });
    const BlogCategory = await blogCategory.find({
        deleted: false,
        status: "display"
    });
    const product = await Product.find({
        deleted: false,
        status: "active",
        featured: "1"
    }).limit(3);
    const blogs = await Blog.find({
        deleted: false,
        status: "display"
    }).sort({ createdAt: "desc" });
    res.render("client/pages/blog/detail", {
        pageTitle: blog.title,
        blog: blog,
        blogCategory: BlogCategory,
        productRecommend: product,
        activeCategory: category ? category.title : null,
        blogs: blogs 
    });
}