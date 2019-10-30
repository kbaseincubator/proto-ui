import {getCookie} from './cookies';

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
// Might return undefined
// TODO:Akiyo this function is doing two things. 
// It might be a function that should be called from async function
export function getUsername(callBack:(username:string)=>void) {
  const token = getToken();
  if (!token) {
    return undefined;
  }
  if (sessionStorage.getItem('kbase_username')) {
    callBack(sessionStorage.getItem('kbase_username'));
  }
  const headers = {'Authorization': token};
  return fetch(window._env.kbase_endpoint + '/auth/api/V2/token', {
    method: 'GET',
    headers,
  })
      .then((resp) => resp.json())
      .then((json) => {
        const username = json.user;
        sessionStorage.setItem('kbase_username', username);
        callBack(username);
      });
}
