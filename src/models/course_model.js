const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  departments: [{
    type: String,
    required: true,
  }],
});


const Course = mongoose.model('Course', courseSchema,);

module.exports = Course;