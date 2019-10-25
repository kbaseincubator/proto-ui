
export function getCookie(name) {
  const vals = document.cookie.split(';')
      .map((s) => s.split('='))
      .filter(([key, val]) => key.trim() === 'kbase_session');
  if (vals && vals.length && vals[0].length === 2) {
    return vals[0][1];
  }
  throw new Error('Unable to fetch non-existent cookie: ' + name);
}
