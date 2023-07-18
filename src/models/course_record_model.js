const mongoose = require('mongoose');

const CourseRecordSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: Date,
  status: {
    type: String,
    enum: ['started', 'completed'],
    default: 'started'
  },
  achievementLevel: {
    type: String,
    enum: ['pass', 'fail']
  }
});

const CourseRecord = mongoose.model('CourseRecord', CourseRecordSchema);

module.exports = CourseRecord

