module.exports.showbankTransfer = (req, res)=>{
    const amount = req.cookies.cartTemp.totalPrice ; 
    const orderId = Date.now(); 
    const transferContent = `TT_${orderId}`; 

    res.render('client/pages/checkout/bank-transfer', {
        amount,
        transferContent
    });
}