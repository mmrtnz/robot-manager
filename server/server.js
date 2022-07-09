'use strict';

// External Dependencies
const dotenv = require('dotenv');
const Hapi = require('@hapi/hapi');
const { initializeApp } = require("firebase/app");

// Internal Dependencies
const { getUser } = require('./services/user');

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "robot-manager-c6b5d.firebaseapp.com",
  projectId: "robot-manager-c6b5d",
  storageBucket: "robot-manager-c6b5d.appspot.com",
  messagingSenderId: "87346250352",
  appId: "1:87346250352:web:1b18707f7495691404aab5",
  measurementId: "G-5TFDD7T29D"
};

const init = async () => {
  const server = Hapi.server({
    port: 8080,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
        headers: ['Authorization'], // an array of strings - 'Access-Control-Allow-Headers'
        exposedHeaders: ['Accept'], // an array of exposed headers - 'Access-Control-Expose-Headers',
        additionalExposedHeaders: ['Accept'], // an array of additional exposed headers
        maxAge: 60,
        credentials: true // boolean - 'Access-Control-Allow-Credentials'
      }
    }
  });

  server.app.firebase = initializeApp(firebaseConfig);
  server.app.dbUrl = 'https://robot-manager-c6b5d-default-rtdb.firebaseio.com/';

  await server.register(require('@hapi/cookie'));
  await server.register(require('@hapi/basic'));

  /**
   * First attempt at auth was via server-side cookies/sessions but stategy was
   * 'missing authentication' according to frontend. Switched to basic auth and
   * client-side cookies instead.
   * */
  server.auth.strategy('session', 'cookie', {
    cookie: {
      name: 'session',
      password: 'robotsrobotsrobotsrobotsrobotsrobots',
      isSecure: false, // Allows us to work via http in localhost
    },
    validateFunc: async (request, session, callback) => {
      // TODO: check db w/ cookie
      return { err, valid: true, credentials: { foo: 'bar' } };
    },
  });


  server.auth.strategy('simple', 'basic', {
    validate: async (request, username, password, h) => {
      const user = await getUser(request.server.app.firebase, username, password);

      if (!user) {
        return { isValid: false, credentials: {} };
      }

      return { isValid: true, credentials: user };
    },
  });

  server.auth.default({ strategy: 'simple' });

  await server.register(require('./routes'));
  await server.start();

  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init();