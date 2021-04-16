import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const container = window.PIXEL_PERFECT_EXTENSION_CONTAINER || document.getElementById('react-app-ext');

ReactDOM.render(
  <App />,
  container
);

