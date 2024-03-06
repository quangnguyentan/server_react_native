const router = require("express").Router();
const blogController = require("../controllers/blogController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary.config");
router.get("/", blogController.getBlogs);
router.get("/:id", blogController.getBlogById);
router.post("/", [verifyAccessToken, isAdmin], blogController.createNewBlogs);
router.put("/like/:id", [verifyAccessToken], blogController.likeBlogs);
router.put(
  "/image/:id",
  [verifyAccessToken, isAdmin],
  uploader.single("image"),
  blogController.uploadImagesBlog
);
router.put("/dislike/:id", [verifyAccessToken], blogController.dislikeBlogs);
router.put(
  "/:id",
  [verifyAccessToken, isAdmin],
  blogController.updatedNewBlogs
);
router.delete("/:id", [verifyAccessToken, isAdmin], blogController.deleteBlogs);

module.exports = router;
