const { getDatabase, ref, get, query } = require('firebase/database');

module.exports = {
  handler: async (request, h) => {
    console.log('GET /bots');

    const db = getDatabase(request.server.app.firebase);
    const dbRef = ref(db, '/bots');
    const q = query(dbRef);
    
    try {
      const snapshot = await get(q); 
      const dbData = snapshot.val();
      return h.response(dbData).code(200);
    } catch (errorObject) {
      console.log('Error getting robots: ' + errorObject);
      return errorObject;
    }
  }
};
