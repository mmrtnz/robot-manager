const { getDatabase, ref, get, query, orderByChild, equalTo } = require('firebase/database');

module.exports = {
  handler: async (request, h) => {
    const { username, password } = JSON.parse(request.payload);

    const db = getDatabase(request.server.app.firebase);
    const dbRef = ref(db, '/users');
    const q = query(dbRef, orderByChild('username'), equalTo(username));
    
    try {
      const snapshot = await get(q); 
      const dbData = snapshot.val();
      
      if (!dbData) {
        return h.response(null).code(401);
      }
      
      const dbPassword = dbData[Object.keys(dbData)[0]].password;
      if (dbPassword !== password) { 
        return h.response(null).code(401);
      }

      return h.response(dbData).code(200);
    } catch (errorObject) {
      console.log('Error reading users: ' + errorObject);
      return errorObject;
    }
  }
};
