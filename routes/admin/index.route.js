const systemConfig = require("../../config/system");

const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");

module.exports = (app)=>{
    const pathAdmin = systemConfig.prefixAdmin;
    app.use(pathAdmin + "/dashboard", dashboardRoutes);
    app.use(pathAdmin + "/product", productRoutes);
}