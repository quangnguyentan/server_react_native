const router = require("express").Router();
const brandCategoryController = require("../controllers/brandController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post(
  "/",
  [verifyAccessToken, isAdmin],
  brandCategoryController.createCategory
);
router.get("/", brandCategoryController.getCategory);
router.put(
  "/:id",
  [verifyAccessToken, isAdmin],
  brandCategoryController.updateCategory
);
router.delete(
  "/:id",
  [verifyAccessToken, isAdmin],
  brandCategoryController.deletedCategory
);
module.exports = router;
