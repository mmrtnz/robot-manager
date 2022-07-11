// External Dependencies
const {
  set,
  ref,
  query,
  orderByChild,
  getDatabase,
  get,
  equalTo,
} = require('firebase/database');
const guid = require('guid');

// Internal Dependencies


const createTask = async (firebase, reqPayload) => {
  const id = guid.create().value;
  const db = getDatabase(firebase);
  const dbRefTask = ref(db, '/tasks/' + id);
  const dbRefBot = ref(db, '/bots/' + reqPayload.bot.id);

  const dbPayloadTask = {
    id,
    date: new Date().toISOString(),
    userId: reqPayload.user.id,
    userName: reqPayload.user.name,
    botId: reqPayload.bot.id,
    botName: reqPayload.bot.name,
    type: reqPayload.task
  };

  const dbPayloadBot = {
    ...reqPayload.bot,
    task: reqPayload.task,
    status: 'busy'
  };

  try {
    await Promise.all([
      set(dbRefTask, dbPayloadTask),
      set(dbRefBot, dbPayloadBot)
    ])
  } catch (err) {
    console.log('Error adding task and updating bot', err);
    return null;
  }

  // Return the latest bots data for socket so that it can get reflected in the
  // app without an extra API call.
  return dbPayloadBot;
};

const updateTaskProgress = async (firebase, task, newProgress) => {
  const db = getDatabase(firebase);
  const dbRefTask = ref(db, '/tasks/' + task.id);
  const dbRefBot = ref(db, '/bots/' + task.botId);

  const isComplete = newProgress >= 100;

  const dbPayloadTask = {
    ...task,
    progress: newProgress,
    status: isComplete ? 'done' : 'in progress',
  };

  const dbPayloadBotComplete = {
    id: task.botId,
    name: task.botName,
    status: 'idle',
    task: '',
    progress: 0,
  };

  // TODO: Add spontaneous errors

  await set(dbRefTask, dbPayloadTask);

  // When complete also update duplicate task data in bot
  if (isComplete) {
    console.log('Successful completion')
    await set(dbRefBot, dbPayloadBotComplete);
  }
};

const getTasksForBot = async (firebase, botId, limit = null) => {
  const db = getDatabase(firebase);
  const dbRef = ref(db, '/tasks');
  const q = query(dbRef, orderByChild('botId'), equalTo(botId));

  const snapshot = await get(q);
  const dbTasks = snapshot.val();

  if (!dbTasks) {
    return [];
  }

  let taskList = Object.values(dbTasks);

  // Sorts tasks in descending order (newest to oldest) 
  taskList = taskList.sort((a, b) => {
    if (new Date(a.date) === new Date(b.date)) {
      return 0;
    }
    return new Date(a.date) > new Date(b.date) ? -1 : 1;
  });

  console.log('sorted', taskList.map(({id, date}) => ({ id, date })));
  return taskList.slice(0, limit || taskList.length);
};

module.exports = {
  createTask,
  getTasksForBot,
  updateTaskProgress
};
