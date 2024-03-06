const brandCategory = require("../models/brand");

const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
  const body = req.body;
  const response = await brandCategory.create(body);
  return res.json({
    success: response ? true : false,
    createdCategory: response ? response : " Cannot create new brand category",
  });
});
const getCategory = asyncHandler(async (req, res) => {
  const response = await brandCategory.find().select("title _id");
  return res.json({
    success: response ? true : false,
    brandCategories: response ? response : " Cannot find brand category",
  });
});
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const response = await brandCategory.findByIdAndUpdate(id, body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    updatedbrandCategories: response
      ? response
      : " Cannot update brand category",
  });
});
const deletedCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await brandCategory.findByIdAndDelete(id);
  return res.json({
    success: response ? true : false,
    deletedbrandCategories: response
      ? response
      : " Cannot delete brand category",
  });
});
module.exports = {
  createCategory,
  getCategory,
  updateCategory,
  deletedCategory,
};
