'use strict'

const { getAll, getBotHistory } = require('./controllers/bots');
const { login, logout } = require('./controllers/session');
const { startTask, stopTask, updateTask } = require('./controllers/tasks');

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
      handler: getAll,
    });
    server.route({
      method: 'GET',
      // Ideal path would be /bot/{id}/tasks but routes with params are throwing
      // a cors error
      path: '/bot/history',
      handler: getBotHistory,
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
    server.route({
      method: 'POST',
      path: '/tasks/update',
      handler: updateTask,
      // Remove auth for demo purposes. In prod we'd want to secure this for
      // admin accounts only
      options: {
        auth: false
      }
    });
  }
}
