const { searchBooks } = require("../controllers/search.controller");

const router = require("express").Router();

router.get("/", searchBooks);

module.exports = router;
