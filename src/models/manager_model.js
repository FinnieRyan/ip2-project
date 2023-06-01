const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstname: String,
  lastname: String,
  department: String
});

const Manager = mongoose.model('Manager', managerSchema);

module.exports = Manager;