const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  rating: { type: Number, required: true },
  userid: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  time: { type: Date, required: true },
  content: { type: String, required: true }
});

const imageSchema = new Schema({
  data: Buffer,
  contentType: String
});

const medicineSchema = new Schema({
  name: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  // 两种存图片方式都留着，第一种太卡了就用第二种
  picture: { type: imageSchema },
  picture_url: String,
  reviews: [reviewSchema]
});

module.exports = mongoose.model('Medicine', medicineSchema);