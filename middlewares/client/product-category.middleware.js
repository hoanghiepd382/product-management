const ProductCategory =  require ("../../models/product-category.model");
const createTreeHelper = require("../../helpers/create-tree");

module.exports.productCategory = async (req, res, next) =>{
    const productCategory = await ProductCategory.find({deleted: false});
    const records = createTreeHelper.createTree(productCategory);

    res.locals.headerProductCategory = records;
    next();
}