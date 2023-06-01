const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  _id: String,
  firstname: String,
  lastname: String,
  department: String
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;