const User = require("../../models/user.model");
const Account = require("../../models/account.model");
const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Blog = require("../../models/blog.model");
const BlogCategory = require("../../models/blog-category.model");
const Order = require("../../models/order.model");

module.exports.dashboard = async (req, res) => {
   const topSaleProduct = await Product.findOne().sort({sales: -1}).select("thumbnail title sales");
   const topRateProduct = await Product.findOne().sort({averageRating: -1}).select("thumbnail title averageRating totalReviews");
   const totalProduct = await Product.countDocuments();
   const totalProductActive = await Product.countDocuments({status: "active"});
   const totalProductInactive = totalProduct - totalProductActive;

   const objectProduct = {
      topSaleProduct: topSaleProduct,
      topRateProduct: topRateProduct,
      totalProduct: totalProduct,
      totalProductActive: totalProductActive,
      totalProductInactive: totalProductInactive
   }

   const totalProductCategory = await ProductCategory.countDocuments();
   const totalProductCategoryActive = await ProductCategory.countDocuments({status: "active"});
   const totalProductCategoryInactive = totalProductCategory - totalProductCategoryActive;

   const objectProductCategory = {
      totalProductCategory: totalProductCategory,
      totalProductCategoryActive: totalProductCategoryActive,
      totalProductCategoryInactive: totalProductCategoryInactive
   };

   const totalBlog = await Blog.countDocuments();
   const totalBlogDisplay = await Blog.countDocuments("status: display");
   const totalBlogHidden = totalBlog - totalBlogDisplay;
   const topViewBlog = await Blog.findOne().sort({views: -1}).select("title views thumbnail");
   const totalBlogCategory = await BlogCategory.countDocuments();

   const objectBlog = {
      totalBlog: totalBlog,
      totalBlogDisplay: totalBlogDisplay,
      totalBlogHidden: totalBlogHidden,
      topViewBlog: topViewBlog,
      totalBlogCategory: totalBlogCategory
   };

   const totalAccount = await Account.countDocuments();
   const totalAccountActive = await Account.countDocuments({status: "active"});
   const totalAccountInactive = totalAccount - totalAccountActive;

   const objectAccount = {
      totalAccount: totalAccount,
      totalAccountActive: totalAccountActive,
      totalAccountInactive: totalAccountInactive
   }

   const totalUser = await User.countDocuments();
   const totalUserActive = await User.countDocuments({status: "active"});
   const totalUserInactive = totalUser - totalUserActive;

   const objectUser = {
      totalUser: totalUser,
      totalUserActive: totalUserActive,
      totalUserInactive: totalUserInactive
   };

   const orders = await Order.find();
   var totalRevenue = 0;
   for (const order of orders) {
      var totalPrice = 0;
      for (const product of order.products) {
         const newPrice = (product.price * (100-product.discountPercentage)/100).toFixed(0);
         totalPrice += newPrice * product.quantity;
      }
      totalRevenue += totalPrice;
   }

   res.render("admin/pages/dashboard/index", {
    pageTitle : "Tổng quan",
    objectProduct: objectProduct,
    objectProductCategory: objectProductCategory,
    objectBlog: objectBlog,
    objectAccount: objectAccount,
    objectUser: objectUser,
    totalRevenue: totalRevenue
   })
  }