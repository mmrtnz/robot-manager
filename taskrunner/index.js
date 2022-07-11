'use strict';

// External Dependencies
const dotenv = require('dotenv');
const axios = require('axios');
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

const timeout = async (activity, timeout = 1000) => {
  await new Promise((resolve, reject) => {
    setTimeout(async () => {
      await activity();
      resolve();
    }, timeout);
  })
}

const getChunkOfTasks = async db => {
  const LIMIT = 10;
  const dbRef = ref(db, '/tasks');
  // Note: Children with a null value for progress come first, meaning tasks
  // that haven't been started yet.
  const q = query(dbRef, orderByChild('progress'), limitToFirst(LIMIT));

  const snapshot = await get(q);
  const dbTasks = snapshot.val();

  if (!dbTasks) {
    return null;
  }
  
  return Object.values(dbTasks).filter(({ progress, status }) => {
    return (progress || 0) < 100 
      && (((status || '') !== 'error') && ((status || '') !== 'cancel'))
  });
}

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
}

// Debugging purposes only
const deleteAllTasks = async db => {
  const dbRef = ref(db, '/tasks');
  const q = query(dbRef);
  const snapshot = await get(q);
  const dbTasks = snapshot.val();

  if (!dbTasks) {
    console.log('No tasks found');
    return;
  }


  const taskList = Object.keys(dbTasks)
  set(dbRef, {});


  console.log(`Deleted ${taskList.length} tasks`);
}

const resetAllBots = async db => {
  const dbRef = ref(db, '/bots');
  const q = query(dbRef);
  const snapshot = await get(q);
  const dbBots = snapshot.val();

  const newBots = {};
  Object.keys(dbBots).forEach(bots => {
    newBots[bots] = {
      ...dbBots[bots],
      progress: 0,
      status: 'idle',
      task: '',
    };
  });
  
  await set(dbRef, newBots);

  console.log(`Resetted ${Object.keys(newBots).length} bots`);
}

const stepFunc = async (task, progress) => {
  return await axios
    .post(`http://localhost:8080/tasks/update?id=${task.id}`, {
      task,
      progress
    })
    .catch(err => {
      console.log('Error updating progress: ', err)
    });
}

const start = async () => {
  console.log('Starting task runner');

  // Connect to other services
  const firebase = initializeApp(firebaseConfig);
  const socket = io('http://localhost:8080');
  const db = getDatabase(firebase);

  if (process.argv.length === 3 && process.argv[2] === 'reset') {
    await resetAllTasks(db);
    await resetAllBots(db);
    process.exit(0);
  }

  if (process.argv.length === 3 && process.argv[2] === 'delete') {
    await deleteAllTasks(db);
    await resetAllBots(db);
    process.exit(0);
  }


  // State variables

  // Time to wait after all tasks have been processed before polling again
  let waitTime = 2; 
  // Current tasks that were polled
  let taskList;
  // Length of taskList
  let len;
  // Flags when a user cancels a job in progress
  let cancelCurrentTask = false;
  // Current task being progressed
  let currentTask = null;

  socket.on('task_stopped', (updatedBotData) => {
    cancelCurrentTask = currentTask && currentTask.botId === updatedBotData.id;
    if (cancelCurrentTask) {
      console.log('Task cancelled by user');
    }
  });

  // Poll for tasks
  taskList = await getChunkOfTasks(db);
  len = taskList ? taskList.length : 0;

  if (!taskList) {
    console.log('No tasks found');
  }

  // Process tasks
  while (true) {
    // Wait when all tasks have been processed
    if (len === 0) {
      console.log(`All tasks have been processed waiting ${waitTime} seconds`);
      waitTime = Math.min(3, waitTime + 1);
      await timeout(() => {}, waitTime * 1000);

      // Next chunk
      taskList = await getChunkOfTasks(db);
      len = taskList ? taskList.length : 0;
      continue;
    }
    waitTime = 1;

    console.log(`Retreived ${len} task${len > 1 ? 's' : ''}`);
    
    // Using stdout to log on same line. forEach runs items in pseudo-parallel
    // so we fall back to for-loop 
    const step = 10;
    for (let i = 0; i < taskList.length; i++) {
      currentTask = taskList[i];
      const startingProgress = currentTask?.progress || 0; 
      process.stdout.write('Starting task ' + currentTask.id);
  
      for (let p = startingProgress; p <= 100; p += step) {
        process.stdout.write('.');
        await timeout(async () => {
          if (cancelCurrentTask) {
            p = 100;
            cancelCurrentTask = false;
          } else {
            // If progressing through task resulted in error we stop said task
            const result = await stepFunc(currentTask, p);
            if (result.data === 'error') {
              console.log('\nError progressing through task!')
              cancelCurrentTask = true;
            }
          }
        }, 500);
      }
      process.stdout.write('Complete!\n');

      // Next chunk
      taskList = await getChunkOfTasks(db);
      len = taskList ? taskList.length : 0;
    }
  }
};

start();