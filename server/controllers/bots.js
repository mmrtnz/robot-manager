// Internal Dependencies
const { getAllBots } = require('../services/bots');

module.exports = {
  handler: async (request, h) => {
    console.log('GET /bots');

    return await getAllBots(request.server.app.firebase);
  }
};
