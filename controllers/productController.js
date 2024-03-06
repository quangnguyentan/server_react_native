const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const createProduct = asyncHandler(async (req, res) => {
  const getData = req.body;
  if (Object.keys(getData).length === 0) throw new Error("Missing inputs");

  if (getData && getData.title) {
    getData.slug = slugify(getData.title, {
      strict: true,
      // remove: / \$*+~.()'"!:@$/g,
      locale: "vie",
    });
    const newProduct = await Product.create(getData);
    return res.status(200).json({
      success: newProduct ? true : false,
      mes: newProduct ? newProduct : "Cannot create a new product",
    });
  }
});
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const products = await Product.findById(id);
  return res.status(200).json({
    success: products ? true : false,
    productDatas: products ? products : "Cannot get products by id",
  });
});
// const getProducts = asyncHandler(async (req, res) => {
//   const queries = { ...req.query };
//   // console.log(queries);
//   const excludeFiels = ["limit", "sort", "page", "fields"];
//   excludeFiels.forEach((e) => delete queries[e]);
//   let queryString = JSON.stringify(queries);
//   queryString = queryString.replace(
//     /\b(gte|gt|lt|lte)\b/g,
//     (macthedEl) => `$${macthedEl}`
//   );
//   const fomatedQueries = JSON.parse(queryString);
//   if (queries?.title) {
//     fomatedQueries.title = { $regex: queries.title, $options: "i" };
//   }
//   try {
//     let queryCommad = Product.find(fomatedQueries)
//       .then(async (response) => {
//         const counts = await Product.countDocuments(fomatedQueries);
//         return res.status(200).json({
//           success: response ? true : false,
//           products: response ? response : "Cannot get products",
//           counts,
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//     if (req.query.sort) {
//       const sortBy = req.query.sort.split(",").join(" ");
//       console.log(sortBy);
//       queryCommad = queryCommad.sort(sortBy);
//     }
//   } catch (err) {
//     console.log(err);
//     throw new Error(err.message);
//   }
// });
const getProducts = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  // console.log(queries);
  const excludeFiels = ["limit", "sort", "page", "fields"];
  excludeFiels.forEach((e) => delete queries[e]);
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gte|gt|lt|lte)\b/g,
    (macthedEl) => `$${macthedEl}`
  );
  const fomatedQueries = JSON.parse(queryString);
  if (queries?.title) {
    fomatedQueries.title = { $regex: queries.title, $options: "i" };
  }
  try {
    let queryCommad = Product.find(fomatedQueries);
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      console.log(sortBy);
      queryCommad = queryCommad.sort(sortBy);
      // console.log(queryCommad);
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      queryCommad = queryCommad.select(fields);
    }

    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
    const skip = (page - 1) * limit;

    queryCommad.skip(skip).limit(limit);
    queryCommad
      .then(async (response) => {
        console.log(response);
        const counts = await Product.countDocuments(fomatedQueries);
        return res.status(200).json({
          success: response ? true : false,
          counts,
          products: response ? response : "Cannot get products",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
});
const ratings = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, pid } = req.body;
  if (!star || !pid) throw new Error("Missing input");
  const ratingProduct = await Product.findById(pid);
  const alreadyRating = ratingProduct?.rating?.find(
    (el) => el.postedBy.toString() === _id
  );
  console.log(alreadyRating);
  if (alreadyRating) {
    await Product.updateOne(
      {
        rating: { $elemMatch: alreadyRating },
      },
      {
        $set: { "rating.$.star": star, "rating.$.comment": comment },
      },
      {
        new: true,
      }
    );
  } else {
    await Product.findByIdAndUpdate(
      pid,
      {
        $push: { rating: { star, comment, postedBy: _id } },
      },
      { new: true }
    );
  }
  const updatedProduct = await Product.findById(pid);
  const ratingCount = updatedProduct.rating.length;
  // 0 + 2.5  + 2.5
  const sumRatings = updatedProduct.rating.reduce(
    (sum, el) => sum + +el.star,
    0
  );
  updatedProduct.totalRatings =
    Math.round((sumRatings * 10) / ratingCount) / 10;
  await updatedProduct.save();
  return res.status(200).json({
    status: true,
    updatedProduct,
  });
});
const uploadImagesProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!req.files) throw new Error("Missing file");
  const response = await Product.findByIdAndUpdate(
    id,
    {
      $push: { images: { $each: req.files.map((el) => el.path) } },
    },
    { new: true }
  );
  return res.status(200).json({
    status: response ? true : false,
    updatedProduct: response ? response : "Cannot upload files",
  });
});

module.exports = {
  createProduct,
  getProductById,
  getProducts,
  ratings,
  uploadImagesProduct,
};
