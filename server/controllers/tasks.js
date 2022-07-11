// Internal Dependencies
const { createTask, updateTaskProgress, updateTaskStatus } = require('../services/tasks');
const { stopBot } = require('../services/bots');

const startTask = async (request, h) => {
  console.log('POST /tasks');

  const { firebase, socket } = request.server.app;

  const payloadJSON = JSON.parse(request.payload);

  /**
   * This isn't needed because all clients are subscribed to the task_created
   * socket event and will update immediately. Two users would need to assign a
   * task almost simultaneously which isn't likely to happen on a demo scale.
   * For production it'd be nice to add tasks to a queue before they get
   * assigned to bots.
   */
  // const latestTask = await getTasksForBot(firebase, payloadJSON.bot.id , 1);

  // We give the user 5 seconds to override the most recently assigned task
  // const timeToLockLatestTask = new Date();
  // timeToLockLatestTask.setSeconds(timeToLockLatestTask.getSeconds() + 5);

  // const timeOfLatestTask = new Date(latestTask[0].time);

  // if (latestTask.length && timeToLockLatestTask > timeOfLatestTask) {
  //   return h.response('required override').code(200);
  // }

  const updatedBotData = await createTask(firebase, payloadJSON);

  // Catch unexpected problem from task creation
  if (!updatedBotData) {
    return h.response().code(500);
  }

  socket.emit('task_created', updatedBotData);

  return h.response().code(200);
}

const stopTask = async (request, h) => {
  console.log('POST /tasks/stop');
  const { firebase, socket } = request.server.app;
  const { bot, task } = JSON.parse(request.payload);

  const updatedBotData = await stopBot(firebase, bot);
  
  // Keep status of errored tasks for recording purposes 
  const hasError = task.status === 'error';
  if (!hasError) {
    await updateTaskStatus(firebase, task, 'cancel');
  }

  if (!updatedBotData) {
    return h.response().code(500);
  }

  socket.emit('task_stopped', updatedBotData);

  return h.response().code(200);
}

const updateTask = async (request, h) => {
  console.log('POST /tasks/update');

  const { firebase, socket } = request.server.app;

  // These request come from task runner via axios which does not stringify its
  // payloads  
  const { task, progress } = request.payload;

  const [error, updatedBotData] = await updateTaskProgress(firebase, task, progress);

  if (error) {
    socket.emit('task_progress_error', updatedBotData);
    return h.response('error').code(200);
  } else if (progress >= 100) {
    socket.emit('task_progress_update', task, progress);
    socket.emit('task_progress_complete', updatedBotData);
  } else {
    socket.emit('task_progress_update', task, progress);
  }
  return h.response().code(200);
};

module.exports = {
  startTask,
  stopTask,
  updateTask
};
