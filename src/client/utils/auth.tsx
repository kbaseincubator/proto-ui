import { getCookie } from './cookies';

// Might return undefined
export function getToken() {
  let token;
  try {
    token = getCookie('kbase_session');
  } catch (e) {
    token = window._env.token;
  }
  return token;
}

// Fetch the username from the auth server or from session storage
// Calls the given callback with the username (or `null`)
export function getUsername(callBack: (username: string | null) => void) {
  const token = getToken();
  if (!token) {
    callBack(null);
  }
  if (sessionStorage.getItem('kbase_username')) {
    callBack(sessionStorage.getItem('kbase_username'));
  }
  const headers = { Authorization: token };
  fetch(window._env.kbase_endpoint + '/auth/api/V2/token', {
    method: 'GET',
    headers,
  })
    .then(resp => resp.json())
    .then(json => {
      const username = json.user;
      sessionStorage.setItem('kbase_username', username);
      callBack(username);
    })
    .catch(reason => console.log(reason));
}
