const router = require("express").Router();
const insertController = require("../controllers/insertData");
router.post("/", insertController.insertProduct);
router.post("/cate", insertController.insertCategory);

module.exports = router;
