const router = require("express").Router();

const { signUp, signIn, logout } = require("../controllers/auth.controller");

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/logout", logout);

module.exports = router;
