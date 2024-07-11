const User = require('../models/user');

// 认证策略配置
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
    function (username, password, done) {
        User.findOne({ username: username }).then(user => {
            if (!user) {
                return done(null, false);
            }
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    return done(err);
                }
                if (!isMatch) {
                    return done(null, false);
                }
                return done(null, user);
            });
        }).catch(err => {
            return done(err);
        });
    }
));
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id).then(user => {
        done(null, user);
    }).catch(err => {
        return done(err);
    });
});

module.exports = passport;