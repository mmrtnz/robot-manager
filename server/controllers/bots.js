// Internal Dependencies
const { getAllBots } = require('../services/bots');
const { getTasksForBot } = require('../services/tasks');

const getAll = async (request, h) => {
  console.log('GET /bots');

  return await getAllBots(request.server.app.firebase);
};

const getBotHistory = async (request, h) => {
  console.log('GET /bots/history');

  return await getTasksForBot(request.server.app.firebase, request.query.botId);
}

module.exports = {
  getAll,
  getBotHistory
};
