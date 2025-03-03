const express = require('express');
const router = express.Router();
const { Order, CartItem } = require('../models/order');  
const mongoose = require('mongoose');



// 创建新订单
router.post('/create', async (req, res) => {
    try {
        const { recipient, contact, delivery, payment, goods } = req.body;
        console.log("username: ", req.user.username);

        // 创建购物车项目数组
        const cartItems = goods.map(item => new CartItem({
            medicine_id: item.medicine_id,
            price: item.price,
            amount: item.amount
        }));

        const now = new Date();
        const offset = 8 * 60;
        const localDate = new Date(now.getTime() + offset * 60000);
        // 创建新订单
        const newOrder = new Order({
            userid: req.user.id,
            username:req.user.username,
            recipient:recipient,
            status:"Pending",
            contact:contact,
            time: localDate, 
            delivery: delivery,
            payment: payment,
            goods: cartItems
        });

        // 保存订单到数据库
        await newOrder.save();
        console.log("订单成功保存到数据库", newOrder.id);
        return res.status(201).json({message:'订单创建成功', status:"10000", order:newOrder});

    } catch (error) {
        return res.status(500).json({ message: "订单创建失败", status:"10022", error : error.message});
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
        return res.status(200).json({
            status:'10000',
            message:'请求成功',
            order:order
        });
    } catch (error) {
        return res.status(500).json({status : "10022", message: "查找订单失败", error: error.message });
    }
});

// 更新订单状态
router.put('/status', async (req, res) => {
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
        return res.status(200).json({status : "10000", message:"更新状态成功", new_status:status});
        
    } catch(error) {
        return res.status(500).json({status:"10022", message: "更新订单状态失败", error : error.message});
    }
}) 

// 用户获取订单列表
router.get('/user-all', async (req, res) => {
    try {
        var orders;
        if (req.query.status === "*") {
            orders = await Order.find({userid:req.user.id});
        }
        else orders = await Order.find({
            userid:req.user.id,
            status:req.query.status
        });
            
        console.log("user_id: ", req.user.id);
        return res.status(200).json({
            status:'10000',
            message:'请求成功',
            orders:orders
        });
    } catch(error) {
        console.log("获取订单失败");
        return res.status(500).json({status:"10099", message:"获取订单失败"});
    }
});

// 管理员获取订单列表
router.get('/admin-all', async (req, res) => {
    try {
        var orders;
        if (req.query.status === "*") {
            orders = await Order.find();
        }
        else {
            orders = await Order.find({status:req.query.status});
        }
        return res.status(200).json({
            status:'10000',
            message:'请求成功',
            orders:orders
        });
    } catch(error) {
        console.log("获取订单失败");
        return res.status(500).json({status:"10099", message:"获取订单失败", error : error.message});
    }
});

// 删除订单
router.delete('/delete', async (req, res) => {
    try {
        const order_id = req.query.order_id;
        const order = await Order.findById(order_id);
        if (!order) {
            return res.status(404).json({status:"10023", message:"订单不存在"})
        }
        await Order.findByIdAndDelete(order_id);
        return res.status(200).json({status:"10000", message : "删除成功"});
    } catch(error) {
        console.log("删除订单失败");
        return res.status(500).json({status:"10099", message:"删除订单失败", error : error.message});
    }
});


module.exports = router;