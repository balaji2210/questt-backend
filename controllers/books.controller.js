const { booksSchema } = require("../models");

const joi = require("joi");

const {
  catchHandler,
  errorHandler,
  responseHandler,
} = require("../utils/handler");

module.exports.getAllBooks = async (req, res) => {
  try {
    const books = await booksSchema.find().sort({ createdAt: -1 });

    if (!books?.length) {
      return errorHandler(res, "No Books Found", 404);
    }

    return responseHandler(res, "Books", books);
  } catch (error) {
    return catchHandler(res, req, error);
  }
};

module.exports.getBookById = async (req, res) => {
  try {
    const schema = joi.object().keys({
      bookId: joi.string().required(),
    });

    await schema.validateAsync(req.query);

    const { bookId } = req.query;

    const book = await booksSchema.findById(bookId);

    if (!book) {
      return errorHandler(res, "Book Not Found", 404);
    }

    return responseHandler(res, "Book Details", book);
  } catch (error) {
    return catchHandler(res, req, error);
  }
};
