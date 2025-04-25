const Product = require("../../models/product.model");
const Review = require("../../models/review.model");
const User = require("../../models/user.model");
const Order = require("../../models/order.model");
const ProductCategory = require("../../models/product-category.model");
const newPriceProduct = require("../../helpers/newPriceProduct");
const getAllCategory = require("../../helpers/getAllCategory");
const paginationHelpers = require("../../helpers/pagination");

module.exports.index = async (req, res)=>{
    const sort = {};
    if (req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue
    }
    else{
        sort.createdAt = "desc"
    }
    let objectPagination = {
        currentPage : 1,
        limitPage : 12
    }
    const totalProduct = await Product.countDocuments({deleted: false});
    objectPagination = paginationHelpers(totalProduct, objectPagination, req.query);
    
    const products = await Product.find({deleted : false})
    .sort(sort)
    .skip(objectPagination.skip)
    .limit(objectPagination.limitPage);
    
    const newProducts = newPriceProduct.newPrice(products);
    
    res.render("client/pages/products/index", {
        pageTitle : "Danh sách sản phẩm",
        products : newProducts,
        objectPagination: objectPagination
    });
  };

module.exports.getProductCategory = async (req, res) =>{
    const sort = {};
    if (req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue
    }
    else{
        sort.createdAt = "desc"
    }
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
        }).sort(sort);
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
        const reviewProduct = await Review.findOne({
            product_id: product._id 
        });
        newPriceProduct.newPriceDetailProduct(product);
        if (reviewProduct){
            for (const review of reviewProduct.review) {
                const userId = review.user_id;
                const user = await User.findOne({
                    _id: userId,
                    deleted: false
                }).select("fullName");
                review.infoUser = user;
            }
            res.render("client/pages/products/detail", {
                pageTitle: product.title,
                product: product,
                reviews: reviewProduct.review
            });
        }
        else{
            res.render("client/pages/products/detail", {
                pageTitle: product.title,
                product: product,            
            });
        }
        
        
       
    } catch (error) {
        console.log(error);
        res.redirect("back");
    }
}

module.exports.review = async (req, res)=>{  
    try {
        const user = await User.findOne({
            tokenUser: req.cookies.tokenUser
        }).select("fullName"); 

        const product = await Product.findOne({
            slug: req.params.productSlug
        }).select("title");

        const order = await Order.findOne({
            userId: user._id,
          });
          if (!order) {
            return res.status(403).json({
              code: 403,
              message: "Vui lòng mua sản phẩm để thực hiện đánh giá",
            });
          }
          else{
            const boughtProduct = order.products.find((item) => item.product_id === product.id);
              if (!boughtProduct) {
                return res.status(403).json({
                  code: 403,
                  message: "Vui lòng mua sản phẩm để thực hiện đánh giá",
                });
              }
          }
        const {star, comment} = req.body;  
        const reviewProduct = await Review.findOne({
            product_id: product.id
        });

        if (!reviewProduct){
            const dataReview = {
                product_id: product.id,
                review: {
                    user_id: user.id,
                    star: star,
                    comment: comment,
                    createdAt: new Date()
                }
            }
            const newReview = new Review(dataReview);
            await newReview.save();
        }
        else{
            const objectReview = {
                user_id: user.id,
                star: star,
                comment: comment,
                createdAt: new Date()
            }
            const existingReview = await Review.findOne({
                product_id: product.id,
                "review.user_id": user.id
              });
            if (existingReview){
                await Review.updateOne({
                    product_id: product.id,
                    "review.user_id": user.id
                },{
                    $set: { "review.$": objectReview}
                })
            }
            else{
                await Review.updateOne({
                    product_id: product.id,                 
                },{
                    $push: {review: objectReview}
                });
            }                           
        }
        const reviewProducts = await Review.findOne({
            product_id: product.id
        });
        const totalStar = reviewProducts.review.reduce((sum, item)=> sum + item.star, 0);
        product.totalReviews = reviewProducts.review.length;
        product.averageRating = product.totalReviews? totalStar/product.totalReviews : 0;
        await product.save();

        res.json({
            code: 200,
            message: "Thành công",
            data: user.fullName
        })
    } catch (error) {
        console.log(error);
        res.json({
            code: 400,
            message: "Thất bại"
        })
    }

}