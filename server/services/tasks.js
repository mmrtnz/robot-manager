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

const getTasksForBot = async (firebase, botId, limit = null) => {
  const db = getDatabase(firebase);
  const dbRef = ref(db, '/tasks');
  const q = query(dbRef, orderByChild('botId'), equalTo(botId));

  const snapshot = await get(q);
  const dbTasks = snapshot.val();

  if (!dbTasks) {
    return [];
  }

  const taskList = Object.values(dbTasks);

  // Sorts tasks in descending order (newest to oldest) 
  taskList.sort((a, b) => new Date(a.date) < new Date(b.date));

  return taskList.slice(0, limit || taskList.length);
};

module.exports = {
  createTask,
  getTasksForBot
};
