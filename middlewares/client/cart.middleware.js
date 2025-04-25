const Cart = require("../../models/cart.model");
const User = require("../../models/user.model");



module.exports.cartId = async (req, res, next) =>{
  try {
    if (!req.cookies.cartId){
        const newCart = new Cart();
        newCart.save();
        res.cookie("cartId", newCart.id,{
            expires: new Date(Date.now() + 100000000)
        });
   }
   else {
    const cart = await Cart.findOne({
        _id: req.cookies.cartId
    });
    const totalQuantity = cart.products.reduce((total, item) =>total + item.quantity, 0);
    cart.totalQuantity = totalQuantity;
    res.locals.minicart = cart;
    
   }
    next();
  } catch (error) {
    console.log(error);
    res.redirect("/");
    return;
  }
}