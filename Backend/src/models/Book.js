const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookModal = new Schema({
  id: { type: Number, uinque: true },
  booktitle: { type: String },
  author: { type: String },
  price: { type: Number },
  quantity: { type: String },
  desc: { type: String },
  category: { type: String },
  mainImage: { type: Array },
  descImage: { type: Array },
  publisher: { type: String },
  infomation: { type: String },
  language: { type: Array },
  status: { type: Number, default: 0 },
  active: { type: Number, default: 1 },
  discount: { type: Number, default: 0 },
  comment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
}, { timestamps: true, });

module.exports = mongoose.model("Book", BookModal);
