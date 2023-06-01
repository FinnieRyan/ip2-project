const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
  manager_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Manager',
  },
  employee_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
  },
});

const User = mongoose.model('User', userSchema,);

module.exports = User;
