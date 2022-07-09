// Internal Dependencies
const { getUser } = require('../services/user');

// Handlers

// Ends session
const logout = async (request, h) => {
  // Delete cookie data
  request.cookieAuth.clear();
  return h.response().code(200);
};

// Checks db for correct username and password combo
const login = async (request, h) => {
  console.log('POST /login');
  
  const { username, password } = JSON.parse(request.payload);
  
  try {
    const user = await getUser(request.server.app.firebase, username, password);
    
    if (!user) {
      return h.response(null).code(401);
    }

    // Add user data to session cookie
    request.cookieAuth.set({ ...user });

    return h.response(user).code(200);
  } catch (errorObject) {
    console.log('Error reading users: ' + errorObject);
    return errorObject;
  }
};

module.exports = {
  login,
  logout
};
