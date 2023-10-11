const {
  addBook,
  getMyBooks,
  updateBook,
  deleteBook,
} = require("../controllers/author.controller");
const { authorMiddleware } = require("../middleware/author.middleware");

const router = require("express").Router();

router.post("/add-book", authorMiddleware, addBook);

router.get("/books", authorMiddleware, getMyBooks);

router.post("/update-book", authorMiddleware, updateBook);

router.post("/delete-book", authorMiddleware, deleteBook);

module.exports = router;
