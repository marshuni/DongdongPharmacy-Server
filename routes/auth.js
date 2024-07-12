const express = require('express');
const router = express.Router();
const User = require('../models/user');

const passport = require('../config/passport'); // 引入 Passport 配置模块


router.use(passport.initialize());
router.use(passport.session());

// 用户登录操作
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ status: '10099', message: 'Internal server error' });
        }
        if (!user) {
            return res.status(401).json({ status: '10011', message: 'Invalid username or password' });
        }
        req.login(user, (err) => {
            if (err) {
                return res.status(500).json({ status: '10099', message: 'Failed to serialize user into session' });
            }
            return res.status(200).json({ status: '10000', message: 'Login successful' });
        });
    })(req, res, next);
});

// 用户注册
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    // 检查用户名是否已经被注册
    User.findOne({ 'username': username }).then(existingUser => {
        if (existingUser) {
            return res.status(400).json({ status: '10012', message: 'Username already exists' });
        }
        // 创建新用户
        const newUser = new User({
            username: username,
            password: password
        });
        newUser.save()
            .then(savedDocument => {
                // 处理保存成功后的逻辑
                console.log('User saved:', savedDocument);
                return res.status(201).json({ status: '10000', message: 'User registered successfully' });
            })
            .catch(err => {
                console.log(err)
                return res.status(500).json({ status: '10099', message: 'Error registering user' });
            });

    }).catch(err => {
        return res.status(500).json({ status: '10099', message: 'Internal Server Error' });
    });
});


// 用户登出
router.get('/logout', function (req, res) {
    req.logout(err => {
        if (err) {
            return res.status(500).json({ message: 'Failed to logout' });
        }
        return res.status(200).json({ status: '10000', message: 'Logout successful' });
    }); // 用户登出
});

module.exports = router;