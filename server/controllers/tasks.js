// Internal Dependencies
const { createTask } = require('../services/tasks');

module.exports = {
  handler: async (request, h) => {
    console.log('POST /tasks');
    createTask(request.server.app.firebase, JSON.parse(request.payload));

    return h.response().code(200);
  }
};
