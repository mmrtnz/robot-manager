'use strict';

// External Dependencies
const dotenv = require('dotenv');
const { io } = require('socket.io-client');
const { initializeApp } = require("firebase/app");
const {
  get,
  getDatabase,
  limitToFirst,
  orderByChild,
  query,
  ref,
} = require('firebase/database');

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

const start = async () => {
  console.log('Starting task runner');
  const firebase = initializeApp(firebaseConfig);
  const socket = io('http://localhost:8080');

  // Get chunk of tasks
  const db = getDatabase(firebase);
  const dbRef = ref(db, '/tasks');
  // Note: Children with a null value for progress come first, meaning tasks
  // that haven't been started yet.
  const q = query(dbRef, orderByChild('progress'), limitToFirst(10));

  const snapshot = await get(q);
  const dbTasks = snapshot.val();

  if (!dbTasks) {
    console.log('No tasks found');
    return;
  }

  const taskList = Object.values(dbTasks);
  const len = taskList.length;

  console.log(`Retreived ${len} task${len > 1 ? 's' : ''}`);
  
  // Progress through tasks 
};

start();