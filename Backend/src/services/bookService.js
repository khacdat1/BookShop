const Book = require("../models/Book.js");
const db = require("../models/index.js");
const Counter = require("../models/Counter");
async function getNextSequence(name) {
  const counter = await Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}
const insertBook = async (data) => {
  let bookData = {};
  const bookId = await getNextSequence('bookId');
  try {
    await db.Book.create({
      id: bookId,
      data
    });
    bookData.errCode = 0;
    bookData.errMessage = "Create book succeed";
  } catch (e) {
    bookData.errCode = 2;
    bookData.errMessage = "Create book failed";
  }
  return bookData;
};
const deleteBook = async (id) => {
  let bookData = {};
  try {
    // await db.Book.deleteOne({
    //   _id: id.id,
    // });
    const book = await db.Book.findOne({ _id: id.id });

    if (book) {
      // Cập nhật trường active thành 0
      book.active = 0;

      // Lưu tài liệu đã được cập nhật trở lại cơ sở dữ liệu
      await book.save();

      console.log('Cập nhật trạng thái active của sách thành công');
    } else {
      console.log('Không tìm thấy sách');
    }
    bookData.errCode = 0;
    bookData.errMessage = "delete book succeed";
  } catch (e) {
    bookData.errCode = 2;
    bookData.errMessage = "delete book failed";
  }
  return bookData;
};
const updateBook = async (data) => {
  let bookData = {};
  try {
    // const bookById = await db.Book.findOne({ _id: data.id });
    const result = await Book.updateOne(
      { _id: data.id },
      {
        booktitle: data.booktitle,
        author: data.author,
        price: data.price,
        quantity: data.quantity,
        datePicker: data.datePicker,
        desc: data.desc,
        category: data.category,
        mainImage: data.mainImage,
        descImage: data.descImage,
        publisher: data.publisher,
        infomation: data.infomation,
        language: data.language,
        discount: data.discount,
        // status: data.status,
      }
    );
    bookData.book = result;
    bookData.errCode = 0;
    bookData.errMessage = "update book succeed";
  } catch (e) {
    bookData.errCode = 2;
    bookData.errMessage = "update book failed";
  }
  return bookData;
};
const getAllBooks = async (body) => {
  try {
    let bookData = {};
    const { page, limit } = body;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = parseInt(limit) || 10;
    const skip = (parsedPage - 1) * parsedLimit;
    const totalCount = await Book.countDocuments({});
    const totalPages = Math.ceil(totalCount / parsedLimit);

    const books = await Book.find({ active: 1 }).skip(skip).limit(parsedLimit);

    return (bookData = {
      page: parsedPage,
      limit: parsedLimit,
      totalPages,
      totalCount,
      books,
    });
  } catch (error) {
    console.error("Error retrieving reviews", error);
    res.status(500).json({ error: "Server error" });
  }
};
const getAllBooksByDiscount = async () => {
  try {
    const books = await db.Book.find({ discount: { $ne: 0 } });
    return books;
  } catch (error) {
    console.error("Error retrieving reviews", error);
    res.status(500).json({ error: "Server error" });
  }
};
const getBookById = async (id) => {
  let bookData = {};
  try {
    const book = await db.Book.findOne({ _id: id.id });
    bookData.book = book;
    bookData.errCode = 0;
    bookData.errMessage = "Get all book succeed";
  } catch (e) {
    bookData.errCode = 2;
    bookData.errMessage = "Get all book failed";
  }
  return bookData;
};
const getBookByCategory = async (category) => {
  let bookData = {};
  try {
    const book = await db.Book.find({ category: category.value, active: 1 });
    bookData.book = book;
    bookData.errCode = 0;
    bookData.errMessage = "Get book by category succeed";
  } catch (e) {
    bookData.errCode = 2;
    bookData.errMessage = "Get book category failed";
  }
  return bookData;
};
const searchBook = async (query) => {
  let bookData = {};
  try {
    const result = await Book.find({
      $or: [
        { booktitle: { $regex: query, $options: "i" } }, // Tìm kiếm theo tiêu đề (không phân biệt chữ hoa/chữ thường)
      ],
    });
    bookData.data = result;
    bookData.status = 200;
    bookData.message = "Succeed";
  } catch (e) {
    bookData.status = 500;
    bookData.message = e;
  }
  return bookData;
};
const searchPageBook = async (query) => {
  let bookData = {};
  try {
    const { page, limit } = query;
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = parseInt(limit) || 10;
    const skip = (parsedPage - 1) * parsedLimit;
    const totalCount = await Book.countDocuments({});
    const totalPages = Math.ceil(totalCount / parsedLimit);
    const books = await Book.find({
      $or: [
        { booktitle: { $regex: query.title, $options: "i" } },

        // Tìm kiếm theo tiêu đề (không phân biệt chữ hoa/chữ thường)
      ],
    })
      .skip(skip)
      .limit(parsedLimit);
    bookData = {
      page: parsedPage,
      limit: parsedLimit,
      totalPages,
      totalCount,
      status: 200,
      message: "Succeed ",
      books,
    };
  } catch (e) {
    bookData.status = 500;
    bookData.message = e;
  }
  return bookData;
};
const getBookRecommendById = async (data) => {
  let bookData = {};
  try {
    const book = await db.Book.findOne({ product_id: +data.id });
    bookData.book = book;
    bookData.errCode = 0;
    bookData.errMessage = "Get all book succeed";
  } catch (e) {
    bookData.errCode = 2;
    bookData.errMessage = "Get all book failed";
  }
  return bookData;
}
module.exports = {
  insertBook: insertBook,
  updateBook: updateBook,
  deleteBook: deleteBook,
  getAllBooks: getAllBooks,
  getBookById: getBookById,
  getBookByCategory: getBookByCategory,
  getAllBooksByDiscount: getAllBooksByDiscount,
  searchBook: searchBook,
  searchPageBook: searchPageBook,
  getBookRecommendById: getBookRecommendById,
};
