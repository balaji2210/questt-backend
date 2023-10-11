const { booksSchema } = require("../models");
const {
  catchHandler,
  errorHandler,
  responseHandler,
} = require("../utils/handler");

const joi = require("joi");

module.exports.searchBooks = async (req, res) => {
  try {
    const schema = joi.object().keys({
      query: joi.string().required(),
    });
    await schema.validateAsync(req.query);

    const { query } = req.query;

    const results = await booksSchema.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    if (!results?.length) {
      return responseHandler(res, "No Search Results", results);
    }

    return responseHandler(res, "Search Results", results);
  } catch (error) {
    return catchHandler(res, req, error);
  }
};
