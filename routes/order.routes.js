const {
  placeOrder,
  getAllOrders,
} = require("../controllers/orders.controller");
const { authenticateUser } = require("../middleware/auth.middleware");

const router = require("express").Router();

router.post("/place", authenticateUser, placeOrder);

router.get("/all", authenticateUser, getAllOrders);

module.exports = router;
