module.exports.newPrice = (product) =>{
    const newProducts = product.map(item => {
        item.newPrice = (item.price * (100 - item.discountPercentage)/100).toFixed(0);
        return item;
    });
    return newProducts;
}

module.exports.newPriceDetailProduct = (product) =>{
    product.newPrice  = (product.price * (100 - product.discountPercentage)/100).toFixed(0);
}