const { data } = require("jquery");
const { bookService } = require("../services");
const bookController = require("./bookController");
const Book = require("../models/Book.js");
const { omitBy } = require('lodash');
async function getAllBooks(req, res) {
  try {
    let body = req.query;
    const book = await bookService.getAllBooks(body);
    res.status(200).json({
      message: "get all succeed",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      message: "failed",
    });
  }
}
async function getBookRecommendById(req, res) {
  try {
    let body = req.params;
    const book = await bookService.getBookRecommendById(body);
    res.status(200).json({
      message: "get all succeed",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      message: "failed",
    });
  }
}
async function getAllBooksByDiscount(req, res) {
  try {
    // let body = req.query;
    const book = await bookService.getAllBooksByDiscount();
    res.status(200).json({
      message: "get all succeed",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      message: "failed",
    });
  }
}
async function getBookById(req, res) {
  try {
    const book = await bookService.getBookById(req.params);
    console.log("1")
    res.status(200).json({
      message: "get book by id succeed",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      message: "failed",
    });
  }
}
async function deleteBook(req, res) {
  try {
    const book = await bookService.deleteBook(req.params);
    res.status(200).json({
      message: "delete succeed",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      message: "failed",
    });
  }
}
async function getBookByCategory(req, res) {
  try {
    const book = await bookService.getBookByCategory(req.query);
    res.status(200).json({
      message: "get book category by id succeed",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      message: "failed",
    });
  }
}
async function updateBook(req, res) {
  try {
    const book = await bookService.updateBook(req.body);
    res.status(200).json({
      message: "insert succeed",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      message: "failed",
    });
  }
}
async function insertBook(req, res) {
  try {
    const book = await bookService.insertBook(req.body);
    res.status(200).json({
      message: "insert succeed",
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      message: "failed",
    });
  }
}
async function handleSearchBook(req, res) {
  try {
    let query = req.query.title;
    if (!query) {
      return res.status(500).json({
        status: 500,
        message: "Missing inputs parameter",
      })
    }
    const book = await bookService.searchBook(query);
    if (book.status === 200) {
      res.status(200).json({
        message: "Search succeed",
        data: book.data,
      });
    }
    else {
      res.status(500).json({
        message: "Search Failed",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "failed",
    });
  }
}
async function handleSearchPageBook(req, res) {
  try {
    let query = req.query;
    if (!query) {
      return res.status(500).json({
        status: 500,
        message: "Missing inputs parameter",
      })
    }
    const book = await bookService.searchPageBook(query);
    if (book.status === 200) {
      res.status(200).json({
        message: "Search succeed",
        result: book,
      });
    }
    else {
      res.status(500).json({
        message: "Search Failed",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "failed",
    });
  }
}
async function handleUploadCloud(req, res) {
  // try {
  //   const fileData = req.file;
  //   console.log(fileData)
  // } catch (e) {
  //   console.log(e)
  // }
}
const getAllbookDeleted = async (req, res) => {
  try {
    const books = await Book.find({ active: 0 });
    res.status(200).json({ data: books });
  } catch (error) {
    console.error('Error fetching deleted books:', error);
    res.status(500).json({ message: 'Failed to fetch deleted books', error });
  }
};
const updateBookDeleted = async (req, res) => {
  try {
    let id = req.params.id;
    let product = omitBy({
      active: 1
    }, (value) => {
      return value === undefined;
    })
    const books = await Book.findByIdAndUpdate(
      id,
      product,
      { new: true }
    );
    if (books) {
      res.status(200).json({ message: 'Update book deleted successfully', data: books });
    }
  } catch (error) {
    console.error('Error fetching deleted books:', error);
    res.status(500).json({ message: 'Failed to fetch deleted books', error });
  }
};
module.exports = {
  getAllBooks: getAllBooks,
  getBookById: getBookById,
  deleteBook: deleteBook,
  getBookByCategory: getBookByCategory,
  getAllBooksByDiscount: getAllBooksByDiscount,
  updateBook: updateBook,
  insertBook: insertBook,
  handleSearchBook: handleSearchBook,
  handleSearchPageBook: handleSearchPageBook,
  handleUploadCloud: handleUploadCloud,
  getBookRecommendById: getBookRecommendById,
  getAllbookDeleted: getAllbookDeleted,
  updateBookDeleted: updateBookDeleted,
};
