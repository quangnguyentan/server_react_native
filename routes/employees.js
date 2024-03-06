const router = require("express").Router();
const employeesController = require("../controllers/employeesController");
router.post("/", employeesController.createEmployees);
router.delete("/:id", employeesController.deleteEmployees);
router.get("/:id", employeesController.getEmployeesById);
router.get("/", employeesController.getAllEmployees);
module.exports = router;
