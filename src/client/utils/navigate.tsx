// pushHistory helper with a callback listener
export function navigateTo(path: string, basePath?: string) {
  window.history.pushState(null, '', path);
}
