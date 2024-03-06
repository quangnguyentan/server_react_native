const Coupon = require("../models/coupon");

const asyncHandler = require("express-async-handler");

const createCoupon = asyncHandler(async (req, res) => {
  const body = req.body;
  const { name, discount, expiry } = req.body;
  if (!name || !discount || !expiry) throw new Error("Missing input");
  const response = await Coupon.create({
    ...body,
    expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000,
  });
  return res.json({
    success: response ? true : false,
    createdCoupon: response ? response : " Cannot create new Coupon ",
  });
});
const updatedNewCoupons = asyncHandler(async (req, res) => {
  const body = req.body;
  const { id } = req.params;
  if (Object.keys(body).length === 0) throw new Error("Missing input");
  if (req.body.expiry)
    req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000;
  //   const { title, description, category } = req.body;
  //   if (!title || !description || !category) throw new Error("Missing input");
  const response = await Coupon.findByIdAndUpdate(id, body);
  return res.json({
    success: response ? true : false,
    updatedCoupon: response ? response : " Cannot update Coupon ",
  });
});
const getCoupons = asyncHandler(async (req, res) => {
  const response = await Coupon.find().select("-createAt -updateAt");
  return res.json({
    success: response ? true : false,
    getCoupon: response ? response : " Cannot get Coupon ",
  });
});
// const excludeFields = "-refreshToken -password -role -createdAt -updatedAt";

const deleteCoupons = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const response = await Coupon.findOneAndDelete(id);
  return res.json({
    success: response ? true : false,
    deletedCoupon: response ? response : " Cannot update Coupon ",
  });
});

module.exports = {
  createCoupon,
  getCoupons,
  deleteCoupons,
  updatedNewCoupons,
};
