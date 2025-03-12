const Product = require("../../models/product.model");
const newPriceProduct = require("../../helpers/newPriceProduct");


module.exports.index = async (req, res) => {
    const featuredProduct = await Product.find({
        featured: "1",
        deleted: false,
        status: "active"
    }).limit(3);
    const newFeaturedProduct = newPriceProduct.newPrice(featuredProduct);
    const getNewProduct = await Product.find({
        deleted: false,
        status: "active"
    }).sort("desc").limit(6);

    const newProduct = newPriceProduct.newPrice(getNewProduct);
    res.render("client/pages/home/index", {
        pageTitle : "Trang chủ",
        FeaturedProduct: newFeaturedProduct,
        NewProduct: newProduct
    });
  };