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
  set,
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

const timeout = async activity => {
  await new Promise((resolve, reject) => {
    setTimeout(async () => {
      await activity();
      resolve();
    }, 1000);
  })
}

const updateTaskProgress = async (db, task, newProgress) => {
  const dbRefTask = ref(db, '/tasks/' + task.id);

  const dbPayloadTask = {
    ...task,
    progress: newProgress,
    status: 'in progress'
  };

  // TODO: Add spontaneous errors

  await set(dbRefTask, dbPayloadTask);

  if (newProgress >= 100) {
    console.log('Successful completion')
  }
};

// Debugging purposes only
const resetAllTasks = async db => {
  const dbRef = ref(db, '/tasks');
  const q = query(dbRef);
  const snapshot = await get(q);
  const dbTasks = snapshot.val();

  const newTasks = {};
  Object.keys(dbTasks).forEach(taskId => {
    newTasks[taskId] = {
      ...dbTasks[taskId],
      progress: 0,
      status: 'created'
    };
  });
  
  await set(dbRef, newTasks);

  console.log(`Resetted ${Object.keys(newTasks).length} tasks`);
  process.exit(0);
}

const start = async () => {
  console.log('Starting task runner');

  // Connect to other services
  const firebase = initializeApp(firebaseConfig);
  const socket = io('http://localhost:8080');
  const db = getDatabase(firebase);

  if (process.argv.length === 3 && process.argv[2] === 'reset') {
    resetAllTasks(db);
    return;
  }

  // Get chunk of tasks
  const dbRef = ref(db, '/tasks');
  // Note: Children with a null value for progress come first, meaning tasks
  // that haven't been started yet.
  const q = query(dbRef, orderByChild('progress'), limitToFirst(2));

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
  // Note: forEach runs items in pseudo-parallel. Fall back to for-loop 
  const step = 10;
  for (let i = 0; i < taskList.length; i++) {
    const currentTask = taskList[i];
    const startingProgress = currentTask?.progress || 0; 
    console.log('Starting task ', currentTask.id);

    for (let p = startingProgress; p <= 100; p += step) {
      await timeout(() => updateTaskProgress(db, currentTask, p));
    }

    // console.log('Complete');
  }
};

start();