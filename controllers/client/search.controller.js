const Product = require("../../models/product.model");
const newPriceHelper = require("../../helpers/newPriceProduct");


module.exports.index = async(req, res) =>{
    const key = req.query.keyword;
    let newProducts = [];
    if (key){
        const regex = new RegExp(key, "i");
        const products = await Product.find({
            title: regex,
            status: "active",
            deleted: false
        });
        newProducts = newPriceHelper.newPrice(products);
}

    res.render("client/pages/searchs/index", {
        pageTitle : "Kết quả tìm kiếm",
        key: key,
        products: newProducts
    });
}