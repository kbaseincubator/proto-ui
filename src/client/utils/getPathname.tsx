// Get the current path without the global prefix.
// Eg. given a prefix of '/x/y' and a pathname of '/x/y/a/b', we want to get '/a/b'
// Always returns a leading slash and no trailing slash.
export function getPathname(basepath: string | null = null): String {
  let pathname = document.location.pathname
    .replace(new RegExp('^' + window._env.url_prefix), '') // Remove global url prefix
    .replace(/\/$/, ''); // Remove trailing slash
  // Make sure we have a leading slash
  if (pathname[0] !== '/') {
    pathname = '/' + pathname;
  }
  if (basepath) {
    pathname = pathname.replace(new RegExp('^' + basepath), '');
  }
  return pathname;
}
