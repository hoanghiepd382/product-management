const axios = require('axios');
const crypto = require('crypto');
const moment = require('moment');

// Thực hiện thanh toán với MoMo
module.exports.createPayment = async ({ cartId, ids, carts, userInfo }) => {
    const orderId = Date.now().toString(); // Tạo orderId duy nhất
    
    // ExtraData: mã hoá thông tin kèm theo
    const extraData = Buffer.from(JSON.stringify({
        cartId,
        ids,
        userInfo
    })).toString('base64');

    // Cấu hình MoMo
    const partnerCode = 'MOMO';
    const accessKey = process.env.accessKey;
    const secretKey = process.env.secretKey;
    const requestId = orderId;
    const orderInfo = `Thanh toán-${cartId}`;
    const redirectUrl = `http://localhost:3000/checkout/success/${orderId}`;
    const ipnUrl = `http://localhost:3000/checkout/ipn`;
    const amount =carts.totalPrice;
    const requestType = "captureWallet";

    const currentTime = moment();
    const expireTime = currentTime.add(10, 'minutes');

    // Chuỗi ký chữ ký
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    const requestBody = {
        partnerCode,
        accessKey,
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        extraData,
        requestType,
        signature,
        lang: 'vi',
        expireTime: expireTime.valueOf().toString()
    };

    // Gửi yêu cầu đến MoMo
    const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    return {
        payUrl: response.data.payUrl,
        orderId
    };
};
