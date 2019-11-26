export function getCookie(name: string) {
  const vals = document.cookie
    .split(';')
    .map(s => s.split('='))
    .filter(([key, val]) => key.trim() === 'kbase_session');
  if (vals && vals.length && vals[0].length === 2) {
    return vals[0][1];
  }
  throw new Error('Unable to fetch non-existent cookie: ' + name);
}

export function removeCookie(name: string) {
  const date = new Date();
  date.setTime(date.getTime() + -1 * 24 * 60 * 60 * 1000);
  document.cookie = name + '=; expires=' + date.toUTCString() + '; path=/';
}
