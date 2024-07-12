const express = require('express');
const router = express.Router();
const { Order, CartItem } = require('../models/order');  // 确保路径正确，这里假设订单和购物车项的模型在order.js文件中定义
const mongoose = require('mongoose');


// 创建新订单
router.post('/create', async (req, res) => {
    try {
        const { userid, status, delivery, payment, goods } = req.body;

        // 创建购物车项目数组
        const cartItems = goods.map(item => new CartItem({
            medicine_id: item.medicine_id,
            price: item.price,
            amount: item.amount
        }));

        // 创建新订单
        const newOrder = new Order({
            userid: userid,
            status: status,
            time: new Date(), 
            delivery: delivery,
            payment: payment,
            goods: cartItems
        });

        // 保存订单到数据库
        await newOrder.save().then(savedDocument => {
            console.log('Order saved:', savedDocument);
            return res.status(201).json({message:'Order Created Successfully', orderId : newOrder.orderId});
        });
    } catch (error) {
        return res.status(500).json({ message: "Falied to create order", error : error.message});
    }
});


// 获取订单数据
router.get('/view', async (req, res) => {
    try {
        // 获得订单的ID
        const orderId = req.query.orderId;
        console.log("orderId", orderId);

        // 通过订单ID在数据库中查找订单
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({ message: "Failed to view order", error: error.message });
    }
});

module.exports = router;
