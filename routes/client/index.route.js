const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const productCategoryMiddleware = require("../../middlewares/client/product-category.middleware");

module.exports = (app)=>{
    app.use(productCategoryMiddleware.productCategory);
    app.use("/", homeRoutes);
    app.use("/product", productRoutes);
}