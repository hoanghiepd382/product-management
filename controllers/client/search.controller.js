const Product = require("../../models/product.model");
const newPriceHelper = require("../../helpers/newPriceProduct");
const convertToSlugHelper = require("../../helpers/convertToSlug");

module.exports.index = async(req, res) =>{
    const type = req.params.type;
    const keyword = req.query.keyword ? req.query.keyword.trim() : "";
    let newProducts = [];

    if (keyword){
        const keywordSlug = convertToSlugHelper.converToSlug(keyword);
        const keywordSlugRegex = new RegExp (keywordSlug, "i");
        const keywordRegex = new RegExp (keyword, "i");

        const products = await Product.find({
            $or : [
                {title: keywordRegex},
                {slug: keywordSlugRegex}
            ]
        });
        newProducts = newPriceHelper.newPrice(products)
    }
    switch (type) {
        case "result":
            res.render("client/pages/searchs/index", {
                pageTitle: `Kết quả: ${keyword}`,
                key: keyword,
                products: newProducts
            });
            break;
        case "suggest":
            res.json({
                code: 200,
                mesage: "Thành công",
                products: newProducts
            });
        default:
            break;
    }
//     const key = req.query.keyword;
//     let newProducts = [];
//     if (key){
//         const regex = new RegExp(key, "i");
//         const products = await Product.find({
//             title: regex,
//             status: "active",
//             deleted: false
//         });
//         newProducts = newPriceHelper.newPrice(products);
// }

}