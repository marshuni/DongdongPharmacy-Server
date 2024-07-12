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
        const newSave = await newOrder.save();
        console.log("订单成功保存到数据库", newSave._id);
        return res.status(201).json({message:'订单创建成功', orderid : newSave._id});

    } catch (error) {
        return res.status(500).json({ message: "订创建失败", error : error.message});
    }
});


// 获取订单数据
router.get('/view', async (req, res) => {
    try {
        // 获得订单的ID
        const order_id = req.query.order_id;
        console.log("订单ID: ", order_id);

        // 通过订单ID在数据库中查找订单
        const order = await Order.findById(order_id);

        if (!order) {
            return res.status(404).json({ status : "10023", message: "查找不到订单" });
        }
        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({ message: "查找订单失败", error: error.message });
    }
});

// 更新订单状态
router.get('/status', async (req, res) => {
    try {
        const order_id = req.query.order_id;
        const status = req.query.status;

        const order = await Order.findById(order_id);
        if (!order) {
            return res.status(404).json({status : "10023", message : "查找不到订单"});
        }

        // 通过ID更新状态
        const updatedOrder = await Order.findByIdAndUpdate(
            order_id,
            { status: status },
            { new: true, runValidators: true }
        );
        return res.status(200).json({message:"更新状态成功", new_status:status});
        
    } catch(error) {
        return res.status(500).json({message: "更新订单状态失败", error : error.message});
    }
}) 

module.exports = router;
