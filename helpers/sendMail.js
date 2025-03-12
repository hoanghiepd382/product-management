const nodemailer = require('nodemailer');

module.exports.sendMail = (email, subject, html)=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: process.env.userEmail,      
            pass: process.env.passEmail      
        }
    });
    
    const mailOptions = {
        from: process.env.userEmail,          
        to: email,       
        subject: subject,        
        html: html
    };
    
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(`❌ Không thể gửi email: ${error}`);
        } else {
            console.log(`✅ Email đã được gửi thành công: ${info.response}`);
        }
    });
}
