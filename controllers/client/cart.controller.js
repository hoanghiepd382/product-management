const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const newPriceProductHelper = require("../../helpers/newPriceProduct");


module.exports.index = async (req, res) =>{
    const cart = await Cart.findOne({_id: req.cookies.cartId});
    
    if (cart.products.length > 0){
        for (const item of cart.products) {
            const product_id = item.product_id;
            const product = await Product.findOne({
                _id: product_id
            }).select("thumbnail title price slug discountPercentage");

            newPriceProductHelper.newPriceDetailProduct(product);
            item.productInfo = product;
            
            item.totalPrice = product.newPrice * item.quantity;
        }
        cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);
    }

    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng",
        cartDetail: cart
    })
}

module.exports.addPost = async (req, res) =>{
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    const cartId = req.cookies.cartId;
  
    const cart = await Cart.findOne({_id: cartId});
    const existProductInCart = cart.products.find(item => item.product_id == productId);
    if (existProductInCart){
        const quantityNew = quantity + existProductInCart.quantity;
        await Cart.updateOne({
            _id: cartId,
            "products.product_id" : productId
        },{
            $set: {
                "products.$.quantity" : quantityNew
            }
        });
    }
    else {
        const objectCart = {
            product_id : productId,
            quantity: quantity
        };
        await Cart.updateOne(
            {
                _id: cartId
        },
        {
            $push: {products: objectCart}
        });
    }
    req.flash("success", "Thêm vào giỏ hàng thành công!");
    res.redirect("back");
}

module.exports.delete = async (req, res) =>{
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;


    await Cart.updateOne({
        _id: cartId
    },{
        $pull : {products : {product_id : productId}}
    });
    req.flash("success", "Xóa sản phẩm thành công!");
    res.redirect("back");
}

module.exports.update = async (req, res) =>{
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = req.params.quantity;

    await Cart.updateOne({
        _id: cartId,
        "products.product_id" : productId
    },{
        $set : {"products.$.quantity": quantity }
    })

    //req.flash("success", "Cập nhật thành công");
    res.redirect("back");
}