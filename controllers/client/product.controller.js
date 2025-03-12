const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const newPriceProduct = require("../../helpers/newPriceProduct");
const getAllCategory = require("../../helpers/getAllCategory");


module.exports.index = async (req, res)=>{
    const products = await Product.find({deleted : false});
    
    const newProducts = newPriceProduct.newPrice(products);
    
    res.render("client/pages/products/index", {
        pageTitle : "Danh sách sản phẩm",
        products : newProducts
    });
  };

module.exports.getProductCategory = async (req, res) =>{

    const category = await ProductCategory.findOne({
        slug: req.params.categorySlug,
        status: "active",
        deleted: false
    });
    if (category){
        const listCate = await getAllCategory.getAllProductCate(category.id);
        const listCateId = listCate.map(item => item.id);
        const product = await Product.find({
            product_category_id: {$in :[category.id, ...listCateId]},
            status: "active",
            deleted: false
        }).sort("desc");
        var newProduct = newPriceProduct.newPrice(product);
    res.render("client/pages/products/index",{
        pageTitle: category.title,
        products: newProduct
        });
    }
    
}
  
module.exports.detail = async (req, res) =>{
    try {
        const find = {
            slug: req.params.productSlug,
            status: "active",
            deleted: false
        }
        const product = await Product.findOne(find);
        if (product.product_category_id){
            const category = await ProductCategory.findOne({
                _id: product.product_category_id,
                status: "active",
                deleted: false
            });
            product.category = category;
        }
        newPriceProduct.newPriceDetailProduct(product);
        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        console.log(error);
        res.redirect("back");
    }
}