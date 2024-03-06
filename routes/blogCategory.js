const router = require("express").Router();
const blogCategoryController = require("../controllers/blogCategory");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post(
  "/",
  [verifyAccessToken, isAdmin],
  blogCategoryController.createCategory
);
router.get("/", blogCategoryController.getCategory);
router.put(
  "/:id",
  [verifyAccessToken, isAdmin],
  blogCategoryController.updateCategory
);
router.delete(
  "/:id",
  [verifyAccessToken, isAdmin],
  blogCategoryController.deletedCategory
);
module.exports = router;
