import { encode } from 'js-base64';

const BASE_URL = 'http://localhost:8080';

// Public routes
export const postLogin = ({ username, password }) => {
  const url = new URL('session/login', BASE_URL);

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      username,
      password: encode(password)
    }),
    credentials: 'include'
  })
  .then(res => {
    if (res.status === 401) {
      throw new Error('Invalid login');
    } else if (!res.ok) {
      throw new Error('Unknown error');
    }
    
    return res.json()
  });
};

export const postLogout = () => {
  const url = new URL('session/logout', BASE_URL);
  
  return fetch(url, {
    method: 'POST'
  })
  .catch(err => {
    console.log('Error logging out', err);
  });
};


// Secured routes
const getAuthHeaders = user => ({
  Authorization: 'Basic ' + encode(`${user.username}:${user.password}`)
});

export const getBots = (user) => {
  const url = new URL('bots', BASE_URL);

  return fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(user),
  })
  .then(res => {
    if (!res.ok) {
      throw new Error('Unknown error');
    }
    return res.json()
  })
  .catch(() => {});
};

export const postTask = (user, bot, task) => {
  const url = new URL('tasks', BASE_URL);

  return fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(user),
    body: JSON.stringify({ task, bot, user })
  })
  .then(res => {
    return res.json()
  })
  .catch(() => {});
}
