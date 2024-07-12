const mongoose = require('mongoose');

var ObjectId = mongoose.Schema.ObjectId;

const cartItemSchema = new mongoose.Schema({
    medicineId: { type: ObjectId, required: true },
    price: { type: Number, required: true },
    amount: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
    orderId: { type: ObjectId, required: true, unique: true },
    userId: { type: ObjectId, required: true },
    status: { type: String, required: true },
    time: Date,
    delivery: String,
    payment: Number,
    goods: [cartItemSchema] 
});


const Order = mongoose.model('Order', orderSchema);
const CartItem = mongoose.model('CartItem', cartItemSchema);


module.exports = { Order, CartItem };
