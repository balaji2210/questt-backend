const joi = require("joi");
const { booksSchema } = require("../models");
const {
  responseHandler,
  catchHandler,
  errorHandler,
} = require("../utils/handler");
const cloudinary = require("cloudinary").v2;

module.exports.addBook = async (req, res) => {
  try {
    const schema = joi.object().keys({
      title: joi.string().required(),
      description: joi.string().required(),
      price: joi.number().required(),
    });

    await schema.validateAsync(req.body);

    let result = null;

    if (req?.files?.image) {
      result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        folder: "books",
      });
    }

    const book = await booksSchema.create({
      title: req.body.title,
      description: req.body.description,
      image: {
        public_id: result?.public_id,
        url: result?.secure_url,
      },
      price: req.body.price,
      author: req.decoded._id,
    });

    return responseHandler(res, "Book Uploaded", book);
  } catch (error) {
    return catchHandler(res, req, error);
  }
};

module.exports.updateBook = async (req, res) => {
  try {
    const schema = joi.object().keys({
      bookId: joi.string().required(),
      title: joi.string().required(),
      description: joi.string().required(),
      price: joi.number().required(),
    });

    await schema.validateAsync(req.body);

    const { bookId, title, description, price } = req.body;

    let book = await booksSchema.findById(bookId);

    let result = null;

    if (req?.files?.image) {
      if (book?.image?.public_id) {
        await cloudinary.uploader.destroy(book?.image?.public_id);
      }
      result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
        folder: "books",
      });
    }

    const update = {
      title,
      description,
      price,
    };

    if (result?.public_id && result?.secure_url) {
      update.image = {
        public_id: result?.public_id,
        url: result?.secure_url,
      };
    }

    book = await booksSchema.findByIdAndUpdate(bookId, update, {
      new: true,
    });

    return responseHandler(res, "Book Updated", book);
  } catch (error) {
    return catchHandler(res, req, error);
  }
};

module.exports.getMyBooks = async (req, res) => {
  try {
    const books = await booksSchema
      .find({ author: req.decoded._id })
      .sort({ createdAt: -1 });

    if (!books?.length) {
      return errorHandler(res, "No Books Found", 400);
    }

    return responseHandler(res, "My Books", books);
  } catch (error) {
    return catchHandler(res, req, error);
  }
};
module.exports.deleteBook = async (req, res) => {
  try {
    const schema = joi.object().keys({
      bookId: joi.string().required(),
    });

    await schema.validateAsync(req.body);

    const { bookId } = req.body;

    let book = await booksSchema.findById(bookId);

    if (!book) {
      return errorHandler(res, "Book Not Found", 400);
    }

    if (book?.image?.public_id) {
      await cloudinary.uploader.destroy(book?.image?.public_id);
    }

    book = await booksSchema.findByIdAndDelete(bookId);

    return responseHandler(res, "Book Deleted", book);
  } catch (error) {
    return catchHandler(res, req, error);
  }
};
