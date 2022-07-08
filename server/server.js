'use strict';

// External Dependencies
const dotenv = require('dotenv');
const Hapi = require('@hapi/hapi');
const { initializeApp } = require("firebase/app");

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

  await server.register(require('./routes'));
  await server.start();

  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

  console.log(err);
  process.exit(1);
});

init();