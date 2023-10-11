const { getAllBooks, getBookById } = require("../controllers/books.controller");

const router = require("express").Router();

router.get("/all", getAllBooks);

router.get("/details", getBookById);

module.exports = router;
