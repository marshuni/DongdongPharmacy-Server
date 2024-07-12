const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  medicine_id: { type: Schema.Types.ObjectId, /* ref: 'Medicine', */ required: true },
  price: { type: Number, required: true },
  amount: { type: Number, required: true }
});

const orderSchema = new Schema({
  userid: { type: Schema.Types.ObjectId, /* ref: 'User', */ required: true },
  status: { type: String, required: true },
  time: { type: Date, required: true },
  delivery: { type: String, required: true },
  payment: { type: Number, required: true },
  goods: [cartItemSchema]
});

const Order = mongoose.model('Order', orderSchema);
const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = { Order, CartItem };
