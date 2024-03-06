const router = require("express").Router();
const productCategoryController = require("../controllers/producCategory");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post(
  "/",
  [verifyAccessToken, isAdmin],
  productCategoryController.createCategory
);
router.get("/", productCategoryController.getCategory);
router.put(
  "/:id",
  [verifyAccessToken, isAdmin],
  productCategoryController.updateCategory
);
router.delete(
  "/:id",
  [verifyAccessToken, isAdmin],
  productCategoryController.deletedCategory
);
module.exports = router;
