const express = require('express');
const router = express.Router();

// 引入Mongoose模型
var User = require('./../models/user');


// 拦截权限错误请求
router.all('/*', function (req, res, next) {
    if (req.user.role === 'user') {
        next();
    } else {
        res.status(403).json({
            status: '10013',
            message: '用户专用接口，请以用户身份登录！',
        });
    }
});

// 获取用户的物流地址列表
router.get('/addresses', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            status: '10000',
            message: '请求成功',
            address: user.address
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: '10099',
            message: 'Internal Server Error'
        });
    }
});

// 添加新地址
router.post('/addresses', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!req.body.address) return res.status(400).json({
            status: '10022',
            message: '请求为空，请检查请求内容'
        });
        // console.log(req.body)
        user.address.push(req.body.address);
        await user.save()
            .then(savedDocument => {
                return res.status(200).json({
                    status: '10000',
                    message: '添加成功',
                    address: user.address
                });
            })
            .catch(err => {
                console.log(err)
                return res.status(400).json({
                    status: '10022',
                    message: '请求有误，请检查请求内容'
                });
            });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: '10099',
            message: 'Internal Server Error'
        });
    }
});

// 更新地址
router.put('/addresses', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        console.log(req.query)
        const address = user.address.id(req.query.addressId);
        if (!address)
            return res.status(404).json({
                status: '10023',
                message: '未找到该地址，请检查请求内容'
            });

        Object.assign(address, req.body.address);
        await user.save()
            .then(savedDocument => {
                return res.status(200).json({
                    status: '10000',
                    message: '修改成功',
                    address: user.address
                });
            })
            .catch(err => {
                console.log(err)
                return res.status(400).json({
                    status: '10022',
                    message: '请求有误，请检查请求内容'
                });
            });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: '10099',
            message: 'Internal Server Error'
        });
    }
});

// 删除地址
router.delete('/addresses', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const address = user.address.id(req.query.addressId);
        if (!address)
            return res.status(404).json({
                status: '10023',
                message: '未找到该地址，请检查请求内容'
            });

        user.address.remove(address)
        await user.save()
            .then(savedDocument => {
                return res.status(200).json({
                    status: '10000',
                    message: '删除成功',
                    address: user.address
                });
            })
            .catch(err => {
                console.log(err)
                return res.status(400).json({
                    status: '10022',
                    message: '请求有误，请检查请求内容'
                });
            });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: '10099',
            message: 'Internal Server Error'
        });
    }
});


module.exports = router;

