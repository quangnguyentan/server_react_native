const Employess = require("../models/employees");

const createEmployees = async (req, res) => {
  const { name, position, email, department, phone } = req.body;
  if (!(name, position, email, department, phone))
    throw new Error("Missing inputs");

  const newEmployess = await Employess.create(req.body);
  return res.status(200).json({
    success: newEmployess ? true : false,
    mes: newEmployess ? "Tạo sản phẩm thành công" : "Tạo sản phẩm thất bại",
  });
};
const deleteEmployees = async (req, res) => {
  const { id } = req.params;
  const employees = await Employess.findByIdAndDelete(id);
  return res.status(200).json({
    success: employees ? true : false,
    mes: employees ? "Xóa sản phẩm thành công" : "Không thể xóa sản phẩm",
  });
};
const updateEmployees = async (req, res) => {
  const { id } = req.params;
  if (!id || Object.keys(req.body).length === 0)
    throw new Error("Missing inputs");
  const employees = await Employess.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  return res.status(200).json({
    success: employees ? true : false,
    mes: employees
      ? "Cập nhật sản phẩm thành công"
      : "Cập nhật sản phẩm thất bại",
  });
};
const getAllEmployees = async (req, res) => {
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
    let queryCommad = Employess.find(fomatedQueries);
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
        const counts = await Employess.countDocuments(fomatedQueries);
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
};
const getEmployeesById = async (req, res) => {
  const { id } = req.params;
  const employees = await Employess.findById(id);
  return res.status(200).json({
    success: employees ? true : false,
    productDatas: employees ? employees : "Cannot get products by id",
  });
};
module.exports = {
  getAllEmployees,
  createEmployees,
  deleteEmployees,
  getEmployeesById,
  updateEmployees,
};
