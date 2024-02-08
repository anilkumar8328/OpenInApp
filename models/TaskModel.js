const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required : true,
  },
  due_date : {
    type : Date,
    required : true
  },
  priority : {
    type:Number,
    required : true
  },
  status : {
    type : String,
    required : true,
    enum : ["TODO","DONE"],
    default : "TODO"
  },
  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  deleted_at : {
    type : Date,
    required : false,
    default :null
  }
},{
  timestamps:true
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;