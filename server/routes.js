'use strict'

exports.plugin = {
  name: 'router',
  register: async function (server, options) {
    server.route({
      method: 'POST',
      path: '/login',
      config: require('./controllers/login'),
    });
    server.route({
      method: 'GET',
      path: '/bots',
      config: require('./controllers/bots'),
    });
  }
}
