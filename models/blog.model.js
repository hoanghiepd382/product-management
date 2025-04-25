const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const blogSchema = new mongoose.Schema({
    title: String,
    thumbnail: String,
    description: String,
    content: String,
    blog_category_id: {
        type:String,
        default: ""
    },
    deleted: {
        type: Boolean,
        default: false
    },
    slug: {
        type: String,
        slug: "title",
        unique: true
    },
    status: String,
    featured: String,
    position: String,
    views: {
        type:Number,
        default: 0
    },
    writedBy: {
        account_id: String,
        writedAt: {
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
            updatedAt: Date
        }
    ]},
    {
        timestamps: true
    }
)

const Blog = mongoose.model("Blog", blogSchema, "blogs");
module.exports = Blog;