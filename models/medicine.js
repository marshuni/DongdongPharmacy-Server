const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  rating: { type: Number, required: true },
  userid: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  time: { type: Date, required: true },
  content: { type: String, required: true }
});

const imageSchema = new Schema({
    name: String,
    data: Buffer,
    contentType: String
});

const medicineSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  picture: { type: imageSchema },
  reviews: [reviewSchema]
});

module.exports = mongoose.model('Medicine', medicineSchema);