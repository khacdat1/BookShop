const db = require("../models/index.js");
const bookService = require("./bookService.js")
const Counter = require("../models/Counter");
async function getNextSequence(name) {
    const counter = await Counter.findOneAndUpdate(
        { _id: name },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return counter.seq;
}
const createComment = async (id_user, id_book, comment, rating) => {
    const commentData = {};
    const commentId = await getNextSequence('commentId');
    console.log(id_user, id_book, comment, rating)
    try {
        let comments = await db.Comment.create({
            id: commentId,
            id_user: id_user,
            id_book: id_book,
            comment: comment,
            rating: rating
        })
        commentData.comment = comments
        commentData.status = 200;
        commentData.message = "Create comment successfully!";
        return commentData
    } catch (e) {
        commentData.status = 500;
        commentData.message = "Create comment failed!";
    }
    return commentData
}
module.exports = {
    createComment
}