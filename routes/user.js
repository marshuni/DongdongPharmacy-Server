const express = require('express');
const router = express.Router();

// 引入Mongoose模型
var User = require('./../models/user');
const Medicine = require('../models/medicine');


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

// 物流地址管理接口
//==================
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

// 购物车管理接口
//==================

// 获取购物车商品列表
router.get('/cart', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            status: '10000',
            message: '请求成功',
            cart: user.cart
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: '10099',
            message: 'Internal Server Error'
        });
    }
});

// 添加商品到购物车
router.post('/cart', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!req.body.cartItem)
            return res.status(400).json({
                status: '10022',
                message: '请求为空，请检查请求内容'
            });
        // 寻找对应的商品
        const medicine = await Medicine.findById(req.body.cartItem.medicineId)
            .then(existingMedicine => {
                if (existingMedicine) {
                    const price = existingMedicine.price;
                    const { medicineId, amount } = req.body.cartItem;

                    // 确保 user.cart 已经初始化为数组
                    if (!Array.isArray(user.cart)) {
                        user.cart = [];
                    }
                    // 判断商品是否在购物车中已经存在
                    const existingCartItem = user.cart.find(item => item.medicine_id.toString() === medicineId)
                    if (existingCartItem){
                        // 若物品已经存在就直接增加数量
                        const newCartItem = {
                            medicine_id: medicineId,
                            price,
                            amount: amount+existingCartItem.amount,
                        };
                        Object.assign(existingCartItem, newCartItem);
                    } else {
                        // 否则新建一个购物车对象
                        const newCartItem = {
                            medicine_id: medicineId,
                            price,
                            amount,
                        };
                        user.cart.push(newCartItem);
                    }
                    // 保存对购物车的修改
                    user.save()
                        .then(savedDocument => {
                            return res.status(200).json({
                                status: '10000',
                                message: '添加成功',
                                cart: user.cart
                            });
                        })
                        .catch(err => {
                            console.log(err)
                            return res.status(400).json({
                                status: '10022',
                                message: '请求有误，请检查请求内容'
                            });
                        });
                }
                else {
                    return res.status(404).json({
                        status: '10023',
                        message: '未找到该药品，请检查请求内容'
                    });
                }
            })
            .catch(err => {
                console.log(err);
                return res.status(404).json({
                    status: '10023',
                    message: '查询相应药品信息有误，请检查请求内容'
                });
            })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: '10099',
            message: 'Internal Server Error'
        });
    }
});

// 从购物车删除商品
// 修改购物车商品数量
// 清空购物车

module.exports = router;

