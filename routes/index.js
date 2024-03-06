const userRouter = require("./user");
const productRouter = require("./product");
const productCategorytRouter = require("./productCategory");
const blogCategoryRouter = require("./blogCategory");
const blogRouter = require("./blog");
const brandCategoryRouter = require("./brand");
const couponRouter = require("./coupon");
const orderRouter = require("./order");
const insertRouter = require("./insertData");

const { errHandler, notFound } = require("../middlewares/errorHandler");
const initRouter = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use("/api/productCategory", productCategorytRouter);
  app.use("/api/blogCategory", blogCategoryRouter);
  app.use("/api/blog", blogRouter);
  app.use("/api/brand", brandCategoryRouter);
  app.use("/api/coupon", couponRouter);
  app.use("/api/order", orderRouter);
  app.use("/api/insert", insertRouter);

  app.use(notFound);
  app.use(errHandler);
};
module.exports = initRouter;

