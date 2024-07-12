const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  rating: { type: Number, required: true },
  userid: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  time: { type: Date, required: true },
  content: { type: String, required: true }
});

module.exports = mongoose.model('Review', reviewSchema);