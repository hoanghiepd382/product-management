const productRoutes = require("./product.route");
const homeRoutes = require("./home.route");
const productCategoryMiddleware = require("../../middlewares/client/product-category.middleware");
const searchRoutes = require('./search.route');
const cartRoutes = require("./cart.route");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const checkoutRoutes = require("./checkout.route");
const userRoutes = require("./user.route");
const userMiddleware = require("../../middlewares/client/user.middleware");
const header = require("../../middlewares/client/search-header.middleware");
const chatRoutes = require("./chat.route");
const usersRoutes = require("./users.route");
const roomsChatRoutes = require("./rooms-chat.route");
const authMiddleware = require("../../middlewares/client/auth.middleware");

module.exports = (app)=>{
    app.use(productCategoryMiddleware.productCategory);
    app.use(cartMiddleware.cartId);
    app.use(userMiddleware.user);

    app.use("/", homeRoutes);
    app.use("/product", header.searchForm, productRoutes);
    app.use("/search", searchRoutes);
    app.use("/cart", cartRoutes);
    app.use("/checkout", checkoutRoutes);
    app.use("/user", userRoutes);
    app.use("/chat", authMiddleware.requireAuth, chatRoutes);
    app.use("/users", authMiddleware.requireAuth, usersRoutes);
    app.use("/rooms-chat", roomsChatRoutes);
}