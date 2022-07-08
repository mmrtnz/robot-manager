const { getDatabase, ref, get, query, orderByChild, equalTo } = require('firebase/database');

module.exports = {
  handler: async (request, h) => {
    const { username, password } = JSON.parse(request.payload);

    const db = getDatabase(request.server.app.firebase);
    const dbRef = ref(db, '/users');
    const q = query(dbRef, orderByChild('username'), equalTo(username));
    
    try {
      const snapshot = await get(q); 
      const user = snapshot.val();

      if (!user || user?.password !== password) {
        return h.response(null).code(401);
      }

      return snapshot.val();
    } catch (errorObject) {
      console.log('Error reading users: ' + errorObject);
      return errorObject;
    }
  }
};
