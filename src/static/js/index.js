import ReactDOM from 'react-dom';
import React from 'react';

// Underline the current item in the top-nav. Plain JS.
const pathname = document.location.pathname;
document.querySelectorAll('[data-hl-nav]').forEach((node) => {
  if (pathname.indexOf(node.getAttribute('data-hl-nav')) === 0) {
    node.classList.add('bb', 'bw1', 'b--blue');
  }
});

class Hello extends React.Component {
  render() {
    return (
      <h1> Hello world </h1>
    );
  }
}

ReactDOM.render(<Hello />, document.getElementById('root'));
