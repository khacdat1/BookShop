const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const CommentSchema = new Schema({
    id_book: { type: Schema.Types.ObjectId, required: true },
    id_user: { type: Schema.Types.ObjectId, required: true },
    comment: { type: String, default: '' },
    rating: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = model('Comment', CommentSchema);
