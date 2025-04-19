const querystring = require('qs');
const crypto = require('crypto');
const moment = require('moment');

module.exports.createPaymentUrl = (req, res,{ carts }) => {
    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const tmnCode = 'QBX02LMO'; // mã website VNPAY cung cấp
    const secretKey = 'ZL9Q688VD7A2RWTZSQGIGJJYLJR84SBF';
    const vnpUrl = ' https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    const returnUrl = 'http://localhost:3000/checkout/vnpay-return';

    const date = moment();
    const createDate = date.format('YYYYMMDDHHmmss');
    const orderId = date.format('HHmmss');
    const amount = carts.totalPrice;
    const bankCode = '';

    let vnp_Params = {
        'vnp_Version': '2.1.0',
        'vnp_Command': 'pay',
        'vnp_TmnCode': tmnCode,
        'vnp_Locale': 'vn',
        'vnp_CurrCode': 'VND',
        'vnp_TxnRef': orderId,
        'vnp_OrderInfo': `Thanh toan don hang #${orderId}`,
        'vnp_OrderType': 'other',
        'vnp_Amount': amount * 100,
        'vnp_ReturnUrl': returnUrl,
        'vnp_IpAddr': ipAddr,
        'vnp_CreateDate': createDate
    };

    if (bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    const paymentUrl = `${vnpUrl}?${querystring.stringify(vnp_Params, { encode: false })}`;

    res.redirect(paymentUrl);
};

function sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    for (let key of keys) {
        sorted[key] = obj[key];
    }
    return sorted;
}

module.exports.returnVnpay = (req, res) =>{
    const params = req.query;
    if (params.vnp_ResponseCode === '00') {
        res.render('client/pages/checkout/success', { message: 'Thanh toán thành công!' });
    } else {
        res.render('client/pages/checkout/failed', { message: 'Thanh toán thất bại hoặc bị hủy.' });
    }
}
