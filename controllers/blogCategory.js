const blogCategory = require("../models/blogCategory");

const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
  const body = req.body;
  const response = await blogCategory.create(body);
  return res.json({
    success: response ? true : false,
    createdCategory: response ? response : " Cannot create new blog category",
  });
});
const getCategory = asyncHandler(async (req, res) => {
  const response = await blogCategory.find().select("title _id");
  return res.json({
    success: response ? true : false,
    blogCategories: response ? response : " Cannot find blog category",
  });
});
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const response = await blogCategory.findByIdAndUpdate(id, body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    updatedblogCategories: response ? response : " Cannot update blog category",
  });
});
const deletedCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await blogCategory.findByIdAndDelete(id);
  return res.json({
    success: response ? true : false,
    deletedblogCategories: response ? response : " Cannot delete blog category",
  });
});
module.exports = {
  createCategory,
  getCategory,
  updateCategory,
  deletedCategory,
};
