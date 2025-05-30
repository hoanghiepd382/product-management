const mongoose = module.require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema({
    title: String,
    parent_id: {
        type: String,
        default: ""
    },
    description: String,
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

const ProductCategory = mongoose.model("ProductCategory", productCategorySchema, "product-category");
module.exports = ProductCategory;