const { getDatabase, ref, get, query, orderByChild, equalTo } = require('firebase/database');

const getUser = async (firebase, username, password) => {
  const db = getDatabase(firebase);
  const dbRef = ref(db, '/users');
  const q = query(dbRef, orderByChild('username'), equalTo(username));
  
  const snapshot = await get(q); 
  const queryMatches = snapshot.val();
  
  if (!queryMatches) {
    return null;
  }
  
  const userData = queryMatches[Object.keys(queryMatches)[0]];
    
  if (!userData) {
    return null;
  }
  
  const dbPassword = userData.password;

  if (dbPassword !== password) { 
    return null;
  }

  return userData;
};

module.exports = {
  getUser
};
