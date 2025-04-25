const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require("../models/user.model");

passport.use(new GoogleStrategy({
  clientID: process.env.ClientID,
  clientSecret: process.env.ClientSecret,
  callbackURL: 'http://localhost:3000/user/login/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });

    if (user) {
      return done(null, user);
    }
    user = await User.findOne({ email: profile.emails[0].value });
    if (user) {
      user.googleId = profile.id;
      await user.save();
      return done(null, user);
    }
    user = new User({
      googleId: profile.id,
      email: profile.emails[0].value,
      fullName: profile.displayName,
      password: '', 
    });
    await user.save();
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/user/login/facebook/callback',
  profileFields: ['id', 'emails', 'displayName'], 
}, async (accessToken, refreshToken, profile, done) => {
  try {
      let user = await User.findOne({ facebookId: profile.id });
      if (user) {
          return done(null, user);
      }
      user = await User.findOne({ email: profile.emails ? profile.emails[0].value : null });
      if (user) {
          user.facebookId = profile.id;
          await user.save();
          return done(null, user);
      }
      user = new User({
          facebookId: profile.id,
          email: profile.emails ? profile.emails[0].value : null,
          fullName: profile.displayName,
          password: '',
      });
      await user.save();
      done(null, user);
  } catch (err) {
      done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;