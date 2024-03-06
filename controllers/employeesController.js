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
  const employees = await Employess.find();
  return res.status(200).json({
    success: employees ? true : false,
    productDatas: employees ? employees : "Cannot get products by id",
  });
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
