const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);


const blogCategorySchema = new mongoose.Schema({
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

const BlogCategory = mongoose.model("BlogCategory", blogCategorySchema, "blog-category");
module.exports = BlogCategory;