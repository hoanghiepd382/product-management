const User = require("../../models/user.model");
const jwt = require('jsonwebtoken');
const passport = require("../../config/passport");

module.exports.requireAuth = async (req, res, next) =>{
    if (!req.cookies.tokenUser){
        res.redirect(`/user/login`);
    }
    else{
        try {
            const decoded = jwt.verify(req.cookies.tokenUser, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            if (user && user.tokenUser === token) {
                res.locals.user = user;
            }
          } catch (err) {
            console.error('Lỗi xác minh token:', err);
          }             
        }
    next(); 
}


module.exports.authGoogle = passport.authenticate('google', { failureRedirect: '/user/login' });

module.exports.authFacebook = passport.authenticate('facebook', { failureRedirect: '/user/login' });

module.exports.loginGoogle = (req, res, next) => {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
}

module.exports.loginFacebook = (req, res, next) => {
    passport.authenticate('facebook', { scope: ['email'] })(req, res, next);
};