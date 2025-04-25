const mongoose = module.require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
    title: String,
    product_category_id: {
        type: String,
        default: ""
    },
    description: String,
    price: Number,
    discountPercentage: Number, 
    stock: Number,
    thumbnail: String,
    status: String,
    featured: String,
    position: String,
    deleted: {
        type: Boolean,
        default: false
    },
    slug: {
        type: String,
        slug: "title",
        unique: true
    },
    createdBy : {
        account_id: String,
        createAt : {
            type: Date,
            default: Date.now
        }
    },
    deletedBy: {
        account_id: String,
        deleteAt: Date
    },
    updatedBy: [
        {
            account_id: String,
            updateAt: Date
        }
    ],
    averageRating: {
        type: Number,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    sales: {
        type: Number,
        default: 0
    }
},
{
    timestamps: true
});

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;