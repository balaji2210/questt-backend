const { orderSchema } = require("../models");
const {
  errorHandler,
  catchHandler,
  responseHandler,
} = require("../utils/handler");

const joi = require("joi");

module.exports.placeOrder = async (req, res) => {
  try {
    const schema = joi.object().keys({
      order: joi.array().items({
        title: joi.string().required(),
        bookId: joi.string().required(),
        image: joi.string().required(),
        count: joi.number().required(),
        price: joi.number().required(),
      }),
    });

    await schema.validateAsync(req.body);

    const { order } = req.body;

    order?.forEach(async (item) => {
      await orderSchema.create({
        ...item,
        userId: req.decoded._id,
      });
    });

    return responseHandler(res, "Order Place", { success: true });
  } catch (error) {
    return catchHandler(res, req, error);
  }
};

module.exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderSchema
      .find({ userId: req.decoded._id })
      .sort({ createdAt: -1 });

    if (!orders?.length) {
      return errorHandler(res, "No Order Found", 404);
    }
    return responseHandler(res, "Orders Placed", orders);
  } catch (error) {
    return catchHandler(res, req, error);
  }
};
