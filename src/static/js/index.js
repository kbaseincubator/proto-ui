console.log('hello world!');

// Underline the current item in the top-nav. Plain JS.
const pathname = document.location.pathname;
document.querySelectorAll('[data-hl-nav]').forEach((node) => {
  if (pathname.indexOf(node.getAttribute('data-hl-nav')) === 0) {
    node.classList.add('bb', 'bw1', 'b--blue');
  }
});
