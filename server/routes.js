'use strict'

const { login, logout } = require('./controllers/session');
const { startTask, stopTask } = require('./controllers/tasks');

exports.plugin = {
  name: 'router',
  register: async function (server, options) {
    server.route({
      method: 'POST',
      path: '/session/login',
      handler: login,
      options: {
        auth: false
      },
    });
    server.route({
      method: 'POST',
      path: '/session/logout',
      handler: logout,
      options: {
        auth: false
      },
    });
    server.route({
      method: 'GET',
      path: '/bots',
      config: require('./controllers/bots'),
    });
    server.route({
      method: 'POST',
      path: '/tasks',
      handler: startTask,
    });
    server.route({
      method: 'POST',
      path: '/tasks/stop',
      handler: stopTask,
    });
  }
}
