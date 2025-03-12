const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
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
    res.render("client/pages/checkout/index", {
        pageTitle: "Trang thanh toán",
        cartDetail: cart
    });
}

module.exports.order = async (req, res) =>{
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    });
    
    let products = [];
    for (const item of cart.products) {
        let objectProduct = {
            product_id : item.product_id,
            price: 0,
            discountPercentage: 0,
            quantity : item.quantity
        };
        const product = await Product.findOne({
            _id: item.product_id,
        }).select("price discountPercentage");

        objectProduct.price = product.price;
        objectProduct.discountPercentage = product.discountPercentage;

        products.push(objectProduct);
    }
    const orderInfo = {
        cartId: cartId,
        userInfo : req.body,
        products : products,
    }

    const newOrder = new Order(orderInfo);
    newOrder.save();

    await Cart.updateOne({
        _id: cartId
    },{
        products : []
    });

    
    res.redirect(`/checkout/success/${newOrder.id}`);
}

module.exports.success = async (req, res) =>{
    const orderId = req.params.orderId;

    const order = await Order.findOne({
        _id: orderId
    });
    for (const product of order.products) {
        const productInfo =  await Product.findOne({
            _id: product.product_id
        }).select("title thumbnail");
        
        product.productInfo = productInfo;
        newPriceProductHelper.newPriceDetailProduct(product);
        product.totalPrice = product.newPrice * product.quantity;
    }
    const totalPriceOrder = order.products.reduce((sum, item) => sum + item.totalPrice, 0);
    order.totalPrice = totalPriceOrder;
    res.render("client/pages/checkout/success", {
        pageTitle: "Đặt hàng thành công",
        orderDetail: order
    });
}