const {CronJob} = require('cron')
const Task = require('../models/TaskModel')
const timezone = 'Asia/Kolkata';
const moment = require('moment');

async function changeTaskPriority() {
    try {
      // Find tasks with due_date in different priority ranges
      const tasksToUpdate = await Task.find({
        due_date: {
          $gte: moment().startOf('day').toDate(), // Today or future dates
        },
      });
  
      // Update priority based on due_date
      tasksToUpdate.forEach(async (task) => {
        const daysUntilDue = moment(task.due_date).diff(moment(), 'days');
  
        if (daysUntilDue === 0) {
          task.priority = 0;
        } else if (daysUntilDue >= 1 && daysUntilDue <= 2) {
          task.priority = 1;
        } else if (daysUntilDue >= 3 && daysUntilDue <= 4) {
          task.priority = 2;
        } else {
          task.priority = 3;
        }
  
        // Save the updated task
        await task.save();
      });
    } catch (error) {
      console.error('Error updating task priorities:', error.message);
    }
  }
exports.updateTaskPriorityCron = new CronJob(
	'30 9 * * *', // cronTime
	async () => {
        console.log('priority task updation is in progress');
        await changeTaskPriority();
    }, // onTick
	null, // onComplete
	true, // start
	timezone // timeZone
);



