const { userConfig } = require("../controllers/users.controller");
const { authenticateUser } = require("../middleware/auth.middleware");

const router = require("express").Router();

router.get("/config", authenticateUser, userConfig);

module.exports = router;
