const { getDatabase, ref, get, query, orderByChild, equalTo } = require('firebase/database');

const createTask = (firebase, taskData) => {
  console.log('creating task', taskData.task);
  
};

module.exports = {
  createTask
};
