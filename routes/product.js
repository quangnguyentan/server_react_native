const router = require("express").Router();
const productController = require("../controllers/productController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config");
router.post("/", [verifyAccessToken, isAdmin], productController.createProduct);
router.put("/ratings", verifyAccessToken, productController.ratings);
router.put(
  "/uploadimage/:id",
  [verifyAccessToken, isAdmin],
  uploader.array("images", 10),
  productController.uploadImagesProduct
);

router.get("/:id", productController.getProductById);
router.get("/", productController.getProducts);
module.exports = router;
