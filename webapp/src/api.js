import { encode } from 'js-base64';

const BASE_URL = 'http://localhost:8080';

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
    if (res.status == 401) {
      throw 'Invalid login'
    } else if (!res.ok) {
      throw 'Unknown error'
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

export const getBots = (user) => {
  const url = new URL('bots', BASE_URL);

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Basic ' + encode(`${user.username}:${user.password}`)
    }
  })
  .then(res => {
    if (!res.ok) {
      throw 'Unknown error'
    }
    
    return res.json()
  })
  .catch(() => {});
};
