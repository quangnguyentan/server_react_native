const Product = require("../models/product");
const ProductCategory = require("../models/productCategory");

const asyncHandler = require("express-async-handler");
const data = require("../data/ecommerce.json");
const slugify = require("slugify");
const dataCategory = require("../data/cate_brand");
const fn = async (product) => {
  await Product.create({
    title: product?.productName,
    slug: slugify(product?.productName) + Math.round(Math.random() * 100) + " ",
    description: product?.ProduceDescription,
    brand: product?.brand,
    prices: Math.round(
      Number(product?.ProducePrice?.match(/\d/g).join("")) / 100
    ),
    category: product?.category[1],
    quantity: Math.round(Math.random() * 1000),
    sold: Math.round(Math.random() * 100),
    images: product?.productImage,
    color: product?.variants?.find((el) => el.label === "Color")?.variants[0],
    thumb: product?.thumb,
    totalRatings: Math.round(Math.random() * 5),
  });
};
const insertProduct = asyncHandler(async (req, res) => {
  const promises = [];
  for (let product of data) {
    promises.push(fn(product));
  }
  await Promise.all(promises);
  return res.json("Done");
});
const fn2 = async (cate) => {
  await ProductCategory.create({
    title: cate?.cate,
    brand: cate?.brand,
    image: cate?.image,
  });
};
const insertCategory = asyncHandler(async (req, res) => {
  const promises = [];
  console.log(promises);
  for (let cate of dataCategory) {
    promises.push(fn2(cate));
  }
  await Promise.all(promises);
  return res.json("Done");
});
module.exports = {
  insertProduct,
  insertCategory,
};
