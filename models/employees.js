const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var employeesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    position: {
      type: String,
    },
    department: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model("Employees", employeesSchema);
