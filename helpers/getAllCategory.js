const ProductCategory = require("../models/product-category.model");

module.exports.getAllProductCate = async (parent_id) =>{
    const getCate = async (parent_id) =>{
        const subs = await ProductCategory.find({
            parent_id: parent_id,
            status: "active",
            deleted: false
        })
        let allSub = [...subs];
        for (const sub of allSub){
            const childs = await getCate(sub.id);
            allSub = allSub.concat(childs);
        }
        return allSub;
    }
    const result = await getCate(parent_id);
    return result;
}