const mongoose = module.require("mongoose");

const reviewSchema = new mongoose.Schema ({
    product_id: String,
    review: [
        {
            user_id: String,
            star: Number,
            comment: {
                type: String,
                default: ""
            },
            createdAt : {
                type: Date,
                default: Date.now
            }
        }
    ]
},
{
    timestamps: true
}
)

const Review = mongoose.model("Review", reviewSchema, "reviews");
module.exports = Review;