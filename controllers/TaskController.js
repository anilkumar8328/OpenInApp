const Task = require('../models/TaskModel');
const { CustomError } = require('../utils/ErrorHandler');
const moment = require('moment');

exports.createTask = async (req, res, next) => {
    try {
        let { title, description, due_date } = req.body
        due_date = moment(due_date, "DD/MM/YYYY").toDate().toISOString();;
        due_date =  moment(due_date);
        let currentDate = moment(new Date())
        
        let diffDate = due_date.diff(currentDate, 'days')

        console.group(due_date,currentDate,diffDate);
        let priority;
        switch (true) {
            case diffDate === 0:
                priority = 0;
                break
            case diffDate > 0 && diffDate <= 2:
                priority = 1;
                break
            case diffDate >= 3 && diffDate <= 4:
                priority = 2;
                break
            case diffDate >= 5:
                priority = 3;
                break
            default:
                throw new CustomError(400,'invalid date');
        }
        const task = new Task({
            title,
            description,
            due_date,
            priority
        })
        await task.save()
        return res.send({
            status: 201,
            message: "Task Created sucessfully",
            data: task
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.getAllTask = async (req, res, next) => {
    try {
        const { status, due_date, page, limit = 10 } = req.query;
        let filter = {}
        if (status) filter.status = status;
        if (due_date) filter.due_date = due_date;
        filter.deleted_at = null;

        const getTask = await Task.find(filter).skip((page - 1) * limit).limit(parseInt(limit))

        if (!getTask) {
            throw new CustomError(404, 'no data fond')
        }
        return res.send({
            status: 200,
            message: "Sucess",
            data: getTask
        })
    } catch (error) {
        next(error)
    }
}

exports.updateTask = async (req, res, next) => {
    try {
        const task_id = req.params.id;
        const { status, due_date } = req.body;

        const task = await Task.findById(task_id)
        if (!task) {
            throw new CustomError(404, 'no task found')
        }
        if (status) {
            if (status == "TODO" || status == "DONE") {
                task.status = status;
            }
            else {
                throw new CustomError(400, `status can only be changed to "TODO" or "DONE"`)
            }
        }
        if (due_date) task.due_date = due_date;

        await task.save()
        res.send({
            status: 201,
            messsage: "sucess",
            data: task
        })
    } catch (error) {
        next(error)
    }
}

exports.deleteTask = async (req, res, next) => {
    try {
        const task_id = req.params.id;
        const task = await Task.findById(task_id);

        if (!task) {
            throw new CustomError(404, 'no task found');
        }

        task.deleted_at = new Date()
        await task.save();

        return res.send({
            status: 200,
            message: "sucess",
            data: task
        })
    } catch (error) {
        next(error)
    }
}


