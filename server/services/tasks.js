// External Dependencies
const { getDatabase, ref, get, query, orderByChild, equalTo, set } = require('firebase/database');
const guid = require('guid');

// Internal Dependencies


const createTask = async (firebase, taskData) => {
  const db = getDatabase(firebase);
  const dbRefTask = ref(db, '/tasks/' + guid.create());
  const dbRefBot = ref(db, '/bots/' + taskData.bot.id);

  const dbPayloadTask = {
    date: new Date().toISOString(),
    user: {
      id: taskData.user.id,
      name: taskData.user.name,
    },
    bot: {
      id: taskData.bot.id,
      name: taskData.bot.name,
    },
    type: taskData.task
  };

  const dbPayloadBot = {
    ...taskData.bot,
    task: taskData.task,
    status: 'busy'
  };

  await Promise.all([
    set(dbRefTask, dbPayloadTask),
    set(dbRefBot, dbPayloadBot)
  ])

  // Return the latest bots data for sock so that it can get reflected in the
  // app without an extra API call.
  return dbPayloadBot;
};

const getTasksForBot = () => {

};

module.exports = {
  createTask,
  getTasksForBot
};
