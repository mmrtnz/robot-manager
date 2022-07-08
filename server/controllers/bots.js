const { getDatabase, ref, get, query } = require('firebase/database');

module.exports = {
  handler: async (request, h) => {
    const db = getDatabase(request.server.app.firebase);
    const dbRef = ref(db, '/bots');
    const q = query(dbRef);
    
    try {
      const snapshot = await get(q); 
      const dbData = snapshot.val();
      console.log('dbData', dbData);
      

      return h.response(dbData).code(200);
    } catch (errorObject) {
      console.log('Error getting robots: ' + errorObject);
      return errorObject;
    }
  }
};