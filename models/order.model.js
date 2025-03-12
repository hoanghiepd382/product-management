const mongoose = module.require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: String,
    cartId: String,
    userInfo: {
        fullName: String,
        phone: String,
        address: String
    },
    products : [
        {
            product_id: String,
            price: Number,
            discountPercentage: Number,
            quantity: Number
        }
    ]},
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", orderSchema, "orders");
module.exports = Order;