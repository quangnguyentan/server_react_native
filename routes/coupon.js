const router = require("express").Router();
const couponController = require("../controllers/couponController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
router.get("/", couponController.getCoupons);
router.post("/", [verifyAccessToken, isAdmin], couponController.createCoupon);
router.put(
  "/:id",
  [verifyAccessToken, isAdmin],
  couponController.updatedNewCoupons
);
router.delete(
  "/:id",
  [verifyAccessToken, isAdmin],
  couponController.deleteCoupons
);

module.exports = router;
