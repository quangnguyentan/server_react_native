const Blog = require("../models/blog");

const asyncHandler = require("express-async-handler");

const createNewBlogs = asyncHandler(async (req, res) => {
  const body = req.body;
  const { title, description, category } = req.body;
  if (!title || !description || !category) throw new Error("Missing input");
  const response = await Blog.create(body);
  return res.json({
    success: response ? true : false,
    createdBlog: response ? response : " Cannot create new blog ",
  });
});
const updatedNewBlogs = asyncHandler(async (req, res) => {
  const body = req.body;
  const { id } = req.params;
  if (Object.keys(body).length === 0) throw new Error("Missing input");
  //   const { title, description, category } = req.body;
  //   if (!title || !description || !category) throw new Error("Missing input");
  const response = await Blog.findByIdAndUpdate(id, body);
  return res.json({
    success: response ? true : false,
    updatedBlog: response ? response : " Cannot update blog ",
  });
});
const getBlogs = asyncHandler(async (req, res) => {
  const response = await Blog.find();
  return res.json({
    success: response ? true : false,
    getBlog: response ? response : " Cannot get blog ",
  });
});
// const excludeFields = "-refreshToken -password -role -createdAt -updatedAt";
const getBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await Blog.findByIdAndUpdate(
    id,
    { $inc: { numberViews: 1 } },
    { new: true }
  )
    .populate("likes", "firstName lastName")
    .populate("dislikes", "firstName lastName");
  return res.json({
    success: response ? true : false,
    getBlog: response,
  });
});

const deleteBlogs = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await Blog.findOneAndDelete(id);
  return res.json({
    success: response ? true : false,
    deletedBlog: response ? response : " Cannot update blog ",
  });
});
const likeBlogs = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;
  // if (!id) throw new Error("Missing input");
  const blog = await Blog.findById(id);
  const alreadyDisliked = blog?.dislikes?.find((el) => el.toString() === _id);
  if (alreadyDisliked) {
    const response = await Blog.findByIdAndUpdate(
      id,
      {
        $pull: { dislikes: _id },
      },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      message: response,
    });
  }
  const isLiked = blog?.likes?.find((el) => el.toString() === _id);
  if (isLiked) {
    const response = await Blog.findByIdAndUpdate(
      id,
      {
        $pull: { likes: _id },
      },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      message: response,
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      id,
      { $push: { likes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      message: response,
    });
  }
});
const dislikeBlogs = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { id } = req.params;
  // if (!id) throw new Error("Missing input");
  const blog = await Blog.findById(id);
  const alreadyLiked = blog?.likes?.find((el) => el.toString() === _id);
  console.log(alreadyLiked);
  if (alreadyLiked) {
    const response = await Blog.findByIdAndUpdate(
      id,
      {
        $pull: { likes: _id },
      },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      message: response,
    });
  }
  const isDisLiked = blog?.dislikes?.find((el) => el.toString() === _id);
  if (isDisLiked) {
    const response = await Blog.findByIdAndUpdate(
      id,
      {
        $pull: { dislikes: _id },
      },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      message: response,
    });
  } else {
    const response = await Blog.findByIdAndUpdate(
      id,
      { $push: { dislikes: _id } },
      { new: true }
    );
    return res.json({
      success: response ? true : false,
      message: response,
    });
  }
});

const uploadImagesBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!req.file) throw new Error("Missing file");
  const response = await Blog.findByIdAndUpdate(
    id,
    {
      image: req.file.path,
    },
    { new: true }
  );
  return res.status(200).json({
    status: response ? true : false,
    updatedBlog: response ? response : "Cannot upload file",
  });
});
module.exports = {
  createNewBlogs,
  updatedNewBlogs,
  deleteBlogs,
  getBlogs,
  getBlogById,
  likeBlogs,
  dislikeBlogs,
  uploadImagesBlog,
};
