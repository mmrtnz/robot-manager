// External Dependencies
const { getDatabase, ref, set, query, get } = require('firebase/database');

// Internal Dependencies

const getAllBots = async (firebase) => {
  const db = getDatabase(firebase);
  const dbRef = ref(db, '/bots');
  const q = query(dbRef);
  
  try {
    const snapshot = await get(q); 
    const dbData = snapshot.val();
    return dbData;
  } catch (errorObject) {
    console.log('Error getting robots: ' + errorObject);
    return errorObject;
  }
}

const stopBot = async (firebase, taskData) => {
  const db = getDatabase(firebase);
  const dbRefBot = ref(db, '/bots/' + taskData.bot.id);

  const dbPayloadBot = {
    ...taskData.bot,
    task: '',
    status: 'idle'
  };

  await set(dbRefBot, dbPayloadBot);

  return dbPayloadBot;
};

module.exports = {
  getAllBots,
  stopBot
};
