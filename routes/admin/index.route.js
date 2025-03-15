const systemConfig = require("../../config/system");
const authMiddleware = require("../../middlewares/admin/auth.middleware");
const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const productCategoryRoutes = require("./product-category.route");
const roleRoutes = require('./role.route');
const accountRoutes = require('./account.route');
const authRoutes = require('./auth.route');
const myAccountRoutes = require('./my-account.route');
const blogRoutes = require("./blog.route");
const blogCategoryRoutes = require("./blog-category.route");


module.exports = (app)=>{
    const pathAdmin = systemConfig.prefixAdmin;
    app.use(pathAdmin + "/dashboard",authMiddleware.requireAuth, dashboardRoutes);
    app.use(pathAdmin + "/product",authMiddleware.requireAuth, productRoutes);
    app.use(pathAdmin + "/product-category", authMiddleware.requireAuth, productCategoryRoutes);
    app.use(pathAdmin + "/role", authMiddleware.requireAuth, roleRoutes); 
    app.use(pathAdmin + "/account", authMiddleware.requireAuth, accountRoutes);
    app.use(pathAdmin + "/auth", authRoutes);
    app.use(pathAdmin + "/my-account", authMiddleware.requireAuth, myAccountRoutes);
    app.use(pathAdmin + "/blog", authMiddleware.requireAuth, blogRoutes);
    app.use(pathAdmin + "/blog-category", authMiddleware.requireAuth, blogCategoryRoutes);
}