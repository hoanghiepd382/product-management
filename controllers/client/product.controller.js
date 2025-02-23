const Product = require("../../models/product.model");
module.exports.index = async (req, res)=>{
    const products = await Product.find({deleted : false});
    
    newProducts = products.map(item => {
        item.newPrice = (item.price * (100 - item.discountPercentage)/100).toFixed(0);
        return item;
    });
    res.render("client/pages/products/index", {
        pageTitle : "Danh sách sản phẩm",
        products : newProducts
    });
  };

module.exports.detail = async (req, res) =>{
    const find = {
        slug: req.params.slug,
        status: "active"
    }
    const product = await Product.findOne(find);
    res.render("client/pages/products/detail", {
        pageTitle: product.title,
        product: product
    });
}