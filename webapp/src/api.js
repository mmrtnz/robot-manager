import { encode } from 'js-base64';

export const postLogin = ({ username, password }) => {
  const url = new URL('login', 'http://localhost:8080');

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      username,
      password: encode(password)
    })
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


export const getBots = () => {
  const url = new URL('bots', 'http://localhost:8080');

  return fetch(url, {
    method: 'GET',
  })
  .then(res => {
    if (!res.ok) {
      throw 'Unknown error'
    }
    
    return res.json()
  });
};
