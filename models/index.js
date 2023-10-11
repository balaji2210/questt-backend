const { userSchema } = require("./users");

const { booksSchema } = require("./books");

const { orderSchema } = require("./orders");

module.exports = {
  userSchema,
  booksSchema,
  orderSchema,
};
