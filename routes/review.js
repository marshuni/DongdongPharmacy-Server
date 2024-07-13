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
        console.log(thisOrder);
        console.log(thisOrder.status);

        if (thisOrder && thisOrder.status === "Delivered") {
            const reviewItem = new Review({
                rating:rating,
                userid:userid,
                time:new Date(),
                content:content
            });
            var thisMedicine = await Medicine.findById(medicine_id);
            if (!thisMedicine) return res.status(404).json({status:"10023", message:"请求错误，找不到该药品"});
            console.log("OK");
            thisMedicine.reviews.push(reviewItem);
            await thisMedicine.save();
            return res.status(200).json({status:"10000", message : "评论成功"});

        }
        else {
            return res.status(404).json({status:"10023", message:"请求错误，订单不存在"})
        }
    } catch (error) {
        return res.status(500).json({status:"10022", message:"评论失败", error:error.message});
    }
});


module.exports = router;