// Internal Dependencies
const { createTask, getTasksForBot } = require('../services/tasks');
const { stopBot } = require('../services/bots');

const startTask = async (request, h) => {
  console.log('POST /tasks');

  const { firebase, socket } = request.server.app;

  const updatedBotData = await createTask(firebase, JSON.parse(request.payload));

  if (!updatedBotData) {
    return h.response().code(500);
  }

  socket.emit('task_created', updatedBotData);

  return h.response().code(200);
}

const stopTask = async (request, h) => {
  console.log('POST /tasks/stop');
  const { firebase, socket } = request.server.app;

  const updatedBotData = await stopBot(firebase, JSON.parse(request.payload));

  if (!updatedBotData) {
    return h.response().code(500);
  }

  socket.emit('task_stopped', updatedBotData);

  return h.response().code(200);
}

module.exports = {
  startTask,
  stopTask
};
