const twilio = require('twilio');
require('dotenv').config()
const { CronJob } = require('cron')
const Task = require('../models/TaskModel') 
const timezone = 'Asia/Kolkata';


const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

async function makeVoiceCall(userPhoneNumber) {
  try {
    // Implement your Twilio voice call logic here
    const call = await client.calls.create({
      twiml: '<Response><Say>Your message here</Say></Response>',
      to: userPhoneNumber,
      from: twilioPhoneNumber,
    });

    console.log('Voice call SID:', call.sid);
  } catch (error) {
    console.error('Twilio Voice Call Error:', error.message);
  }
}

async function scheduleVoiceCalls() {
  const overdueTasks = await Task.find({ priority: 0, due_date: { $lt: new Date() } }).populate('users');

  for (const task of overdueTasks) {
    const { user } = task;
    if (user) {
      const { phone_number, priority } = user;

      // Check if the user hasn't been called yet
      if (!user.called) {
        // Call the user based on priority
        await makeVoiceCall(phone_number);

        // Mark the user as called
        user.called = true;
        await user.save();

        console.log(`Called user ${user._id} with priority ${priority}`);
      }
    }
  }
}


exports.scheduleCall = new CronJob(
  '30 9 * * *', // cronTime
  async () => {
    console.log('Running voice calling cron job...');
    await scheduleVoiceCalls();
  }, // onTick
  null, // onComplete
  true, // start
  timezone // timeZone
);