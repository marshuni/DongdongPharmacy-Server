const express = require('express');
const router = express.Router();

const Review = require('../models/review');
const Medicine = require('../models/medicine');
const {Order, CartItem} = require('../models/order');
const mongoose = require('mongoose');



router.post('/', async (req, res) => {
    try {       
        const userid = req.user.id;
        const {order_id, medicine_id, rating, content} = req.body;

        const thisOrder = await Order.findOne({
            userid:userid,
            _id:order_id
        });
        if (!thisOrder || thisOrder.status != "Delivered") 
            return res.status(404).json({status:"10023", message:"请求错误，订单不存在"});   // 查找订单是否存在，如果不存在则直接返回信息
        else {
            // 检查订单中是否有该药品
            const medicineInOrder = thisOrder.goods.some(item => item.medicine_id.toString() === medicine_id);
            if (!medicineInOrder) {
                return res.status(404).json({ status: "10025", message: "订单中不包含指定的药品" });
            }

            // 新建一个评论项，并将评论插入到药品的评论列表中
            const reviewItem = new Review({
                rating:rating,
                userid:userid,
                time:new Date(),
                content:content
            });
            var thisMedicine = await Medicine.findById(medicine_id);
            // 如果数据库中不存在药品ID，应该不可能
            if (!thisMedicine) return res.status(404).json({status:"10023", message:"请求错误，找不到该药品"});
            console.log("OK");
            thisMedicine.reviews.push(reviewItem);
            await thisMedicine.save();
            return res.status(200).json({status:"10000", message : "评论成功"});
        }
    } catch (error) {
        return res.status(500).json({status:"10022", message:"评论失败", error:error.message});
    }
});


module.exports = router;