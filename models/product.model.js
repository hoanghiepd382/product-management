const mongoose = module.require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productSchema = new mongoose.Schema({

    title: String,
    description: String,
    price: Number,
    discountPercentage: Number, 
    stock: Number,
    thumbnail: String,
    status: String,
    position: String,
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt : Date,
    slug: {
        type: String,
        slug: "title",
        unique: true
    }
},
{
    timestamps: true
});

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;