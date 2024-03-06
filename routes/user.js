const userController = require("../controllers/userController");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const router = require("express").Router();

router.post("/register", userController.register);
router.put("/finalregister/:token", userController.finalRegister);
router.post("/login", userController.login);
router.get("/current", [verifyAccessToken], userController.getCurrent);
router.post("/refreshtoken", userController.refreshAcessToken);
router.get("/logout", userController.logout);
router.post("/forgotpassword", userController.fogotPassword);
router.put("/resetpassword", userController.resetPassword);
router.put("/address", [verifyAccessToken], userController.updateUserAddress);
router.put("/cart", [verifyAccessToken], userController.updateCart);
// router.use(verifyAccessToken);
router.get("/", [verifyAccessToken, isAdmin], userController.getUsers);

module.exports = router;
