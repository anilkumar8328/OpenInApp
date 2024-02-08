const mongoose = require('mongoose');

const subTaskSchema = new mongoose.Schema({
  task_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  },
  status: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
  deleted_at : {
    type : Date,
    required : false,
    default :null
  }
},{
  timestamps:true
});

const subTask = mongoose.model('subTask', subTaskSchema);

module.exports = subTask;