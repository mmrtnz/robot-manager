'use strict';

// External Dependencies
const dotenv = require('dotenv');
const axios = require('axios');
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

const getChunkOfTasks = async db => {
  const LIMIT = 2;
  const dbRef = ref(db, '/tasks');
  // Note: Children with a null value for progress come first, meaning tasks
  // that haven't been started yet.
  const q = query(dbRef, orderByChild('progress'), limitToFirst(LIMIT));

  const snapshot = await get(q);
  const dbTasks = snapshot.val();

  return dbTasks;
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
  await axios
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
  const db = getDatabase(firebase);

  if (process.argv.length === 3 && process.argv[2] === 'reset') {
    await resetAllTasks(db);
    await resetAllBots(db);
    process.exit(0);
  }

  // Poll for tasks
  let dbTasks = await getChunkOfTasks(db);

  if (!dbTasks) {
    console.log('No tasks found');
    return;
  }

  // Process tasks
  let taskList = Object.values(dbTasks);
  let len = taskList.length;
  
  do {
    console.log(`Retreived ${len} task${len > 1 ? 's' : ''}`);
    
    // Using stdout to log on same line. forEach runs items in pseudo-parallel
    // so we fall back to for-loop 
    const step = 10;
    for (let i = 0; i < taskList.length; i++) {
      const currentTask = taskList[i];
      const startingProgress = currentTask?.progress || 0; 
      process.stdout.write('Starting task ' + currentTask.id);
  
      for (let p = startingProgress; p <= 100; p += step) {
        process.stdout.write('.');
        await timeout(async () => {
          await stepFunc(currentTask, p);
        });
      }
      process.stdout.write('\n');

      // Next chunk
      dbTasks = await getChunkOfTasks(db);
      taskList = Object.values(dbTasks);
      len = taskList.length;
    }
  } while (len > 0);

  console.log('All tasks have been processed');
  process.exit(0);
};

start();