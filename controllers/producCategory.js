const productCategory = require("../models/productCategory");

const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
  const body = req.body;
  const response = await productCategory.create(body);
  return res.json({
    success: response ? true : false,
    createdCategory: response
      ? response
      : " Cannot create new product category",
  });
});
const getCategory = asyncHandler(async (req, res) => {
  // const response = await productCategory.find().select("title _id");
  const response = await productCategory.find();
  return res.json({
    success: response ? true : false,
    productCategories: response ? response : " Cannot find product category",
  });
});
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const response = await productCategory.findByIdAndUpdate(id, body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    updatedproductCategories: response
      ? response
      : " Cannot update product category",
  });
});
const deletedCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await productCategory.findByIdAndDelete(id);
  return res.json({
    success: response ? true : false,
    deletedproductCategories: response
      ? response
      : " Cannot delete product category",
  });
});
module.exports = {
  createCategory,
  getCategory,
  updateCategory,
  deletedCategory,
};
