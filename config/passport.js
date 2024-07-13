const User = require('../models/user');
const Admin = require('../models/admin');

// 认证策略配置
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
passport.use('user', new LocalStrategy(
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

passport.use('admin', new LocalStrategy(
    function (username, password, done) {
        Admin.findOne({ username: username }).then(admin => {
            if (!admin) {
                return done(null, false);
            }
            bcrypt.compare(password, admin.password, (err, isMatch) => {
                if (err) {
                    return done(err);
                }
                if (!isMatch) {
                    return done(null, false);
                }
                return done(null, admin);
            });
        }).catch(err => {
            return done(err);
        });
    }
));

passport.serializeUser(function (user, done) {
    if (user.role === 'admin') {
        // 序列化管理员用户的 ID
        done(null, { id: user.id, role: 'admin' });
    } else {
        // 序列化普通用户的 ID
        done(null, { id: user.id, role: 'user' });
    }
});

passport.deserializeUser(function (data, done) {
    if (data.role === 'admin') {
        // 反序列化管理员用户的 ID
        Admin.findById(data.id)
            .then(admin => {
                done(null, admin);
            })
            .catch(err => {
                return done(err);
            });
    } else {
        // 反序列化普通用户的 ID
        User.findById(data.id)
            .then(user => {
                done(null, user);
            })
            .catch(err => {
                return done(err);
            });
    }
});
module.exports = passport;