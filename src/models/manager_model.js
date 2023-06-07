const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
  _id: String,
  firstname: String,
  lastname: String,
  department: String,
  employees: [{
    type: String,
    ref: 'Employee'
  }]
});

const Manager = mongoose.model('Manager', managerSchema);

module.exports = Manager;