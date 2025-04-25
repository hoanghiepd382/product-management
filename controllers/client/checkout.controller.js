const axios = require("axios");
const https = require('https');
const crypto = require('crypto');
const moment = require('moment');
const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const User = require("../../models/user.model");
const newPriceProductHelper = require("../../helpers/newPriceProduct");
const paymentMomo = require("../../payments/momo/payment");
const paymentBank = require("../../payments/bank/payment");
const paymentVnpay = require("../../payments/vnpay/payment");


module.exports.index = async (req, res) => {
    const ids = req.body.id;
    const quantities = req.body.quantity;
    const user = await User.findOne({
        tokenUser: req.cookies.tokenUser 
    }).select("fullName phone address");
    console.log(user);
    const cart = await Cart.findOne({
        _id: req.cookies.cartId
    });

    let carts = {
        products: [],
        totalPrice: 0
    };

    if (ids) {
        const idsArray = Array.isArray(ids) ? ids : [ids];
        const quantitiesArray = Array.isArray(quantities) ? quantities : [quantities];

        for (let i = 0; i < idsArray.length; i++) {
            const product_id = idsArray[i];
            const productInCart = cart.products.find(p => p.product_id === product_id);
            const quantity = productInCart ? productInCart.quantity : 1;
            const product = await Product.findOne({
                _id: product_id
            }).select("thumbnail title price slug discountPercentage");
            if (product) {
                newPriceProductHelper.newPriceDetailProduct(product);

                const item = {
                    product_id,
                    quantity,
                    productInfo: product,
                    totalPrice: product.newPrice * quantity
                };

                carts.products.push(item);
                carts.totalPrice += item.totalPrice;
            }
        }
        res.cookie("ids", idsArray);
        res.cookie("cartTemp", carts);
    }
    else{
        req.flash("error", "Vui lòng chọn ít nhất 1 sản phẩm");
        res.redirect("back");
        return;
    }
    res.render("client/pages/checkout/index", {
        pageTitle: "Trang thanh toán",
        cartDetail: carts,
        userBuy: user
    });
};

module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartId;
    const ids = req.cookies.ids;
    const carts = req.cookies.cartTemp; 
    const userInfo = req.body;
    const method = req.body.paymentMethod;
    if (method === 'momo') {
        try {
            const { payUrl } = await paymentMomo.createPayment({ cartId, ids, carts, userInfo });
            return res.redirect(payUrl);
        } catch (error) {
            console.error('Lỗi thanh toán MoMo:', error.message);
            return res.redirect('/checkout/failed');
        }
    } else if (method === 'vnpay'){
        paymentVnpay.createPaymentUrl(req, res, {carts});
    }
     else  {
        paymentBank.showbankTransfer(req, res);
    }
    
};

module.exports.success = async (req, res) =>{
    res.clearCookie("ids");
    res.clearCookie("cartTemp");

    const orderId = req.params.orderId;
    const resultCode = req.query.resultCode;
    const extraData = req.query.extraData;

    if (resultCode !== "0") {
        return res.render("client/pages/checkout/failed", {
            pageTitle: "Thanh toán thất bại",
            message: "Thanh toán không thành công hoặc đã bị huỷ. Vui lòng thử lại!"
        });
    }
    const decodedData = JSON.parse(Buffer.from(extraData, 'base64').toString('utf8'));
    const { cartId, ids, userInfo } = decodedData;
    const cart = await Cart.findOne({ _id: cartId });

    let products = [];
    for (const id of ids) {
        const productInCart = cart.products.find(p => p.product_id === id);
        const quantity = productInCart.quantity;

        const product = await Product.findOne({ _id: id }).select("price discountPercentage sales");
        const totalSale = product.sales + quantity;
        await Product.updateOne({
            _id: id
        },{
            sales: totalSale
        })
        const productData = {
            product_id: id,
            price: product.price,
            discountPercentage: product.discountPercentage,
            quantity
        };
        products.push(productData);
    }

    const newOrder = new Order({
        cartId,
        userInfo,
        products
    });
    await newOrder.save();
    const newProducts = cart.products.filter(item => !ids.includes(item.product_id));
    await Cart.updateOne({ _id: cartId }, { products: newProducts });
    for (const product of newOrder.products) {
        const productInfo = await Product.findOne({
            _id: product.product_id
        }).select("title thumbnail");

        product.productInfo = productInfo;
        const newPrice = product.price * (1 - product.discountPercentage / 100);
        product.totalPrice = newPrice * product.quantity;
    }

    const totalPriceOrder = newOrder.products.reduce((sum, item) => sum + item.totalPrice, 0);
    newOrder.totalPrice = totalPriceOrder;

    res.render("client/pages/checkout/success", {
        pageTitle: "Đặt hàng thành công",
        orderDetail: newOrder
    });
}

module.exports.failed = async (req, res)=>{
    res.render("client/pages/checkout/failed");
}
