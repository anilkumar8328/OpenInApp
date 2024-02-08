const subTask = require("../models/SubTaskModel")
const {CustomError} = require('../utils/ErrorHandler')
const Task = require('../models/TaskModel')

exports.createSubtask = async (req,res,next) => {
    try {
        const {task_id} = req.body
        const getTask = await Task.findOne({_id : task_id})
        if(!getTask) {
            throw new CustomError(400, `task Doesn't exist`);
        }
        const subtask = new subTask({
            task_id
        })
        await subtask.save()
        res.send({
            status : 201,
            message : "Sub Task has been created",
            data : subTask
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.getAllSubtask = async (req,res,next) => {
    try {
        const {task_id} = req.query;
        let filter = {};
        if(task_id) filter.task_id = task_id;
        filter.deleted_at =  null;
        let getSubTask = await subTask.find(filter).populate('task_id')
        if(!getSubTask) {
            throw new CustomError(400, 'sub-task not found')
        }
        return res.send({
            status : 200,
            message : "sucess",
            data : getSubTask
        })
    } catch (error) {
        next(error)
    }
}

exports.updateSubtask = async (req,res,next) => {
    try {
        const task_id = req.params.id;
        const {status} = req.body;
    
        const task = await subTask.findById(task_id)
        if(!task){
            throw new CustomError(400, 'no task found')
        }
        if(status) {
            if(status == 1 || status == 0){
                task.status = status
            }
            else {
                throw new CustomError(400, `Status can only be changed to "0" or "1"`)
            }
        }
        else {
            throw new CustomError(400, `Status can only be changed and cannot be empty`)
        }
    
        await task.save()
        res.send({
            status : 201,
            messsage : "sucess",
            data : task
        })
    } catch (error) {
        next(error)
    }
}

exports.deleteSubtask = async(req,res,next) => {
    try {
        const task_id = req.params.id;
        const task = await subTask.findById(task_id);

        if(!task) {
            throw new CustomError(404, 'no task found');
        }

        task.deleted_at = new Date()
        await task.save();

        return res.send({
            status : 200,
            message : "sucess",
            data : task
        })
    } catch (error) {
        next(error)
    }
}