const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  _id: String,
  firstname: String,
  lastname: String,
  department: String,
  manager_id: {
    type: String,
    ref: 'Manager'
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  completedCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }]
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;