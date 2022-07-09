'use strict'

const { login, logout } = require('./controllers/session');

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
    });
    server.route({
      method: 'GET',
      path: '/bots',
      config: require('./controllers/bots'),
    });
  }
}
