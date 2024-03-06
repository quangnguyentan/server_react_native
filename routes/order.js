const router = require("express").Router();
const orderController = require("../controllers/orderController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
router.post("/", verifyAccessToken, orderController.createOrder);
router.put(
  "/status/:oid",
  verifyAccessToken,
  isAdmin,
  orderController.updateStatus
);
router.get("/", verifyAccessToken, orderController.getUserOrder);

module.exports = router;
