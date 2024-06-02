const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const CommentSchema = new Schema({
    id: { type: Number, uinque: true },
    id_book: { type: Number, required: true },
    id_user: { type: Number, required: true },
    comment: { type: String, default: '' },
    rating: { type: Number }
}, { timestamps: true });

module.exports = model('Comment', CommentSchema);
