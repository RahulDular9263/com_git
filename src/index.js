import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Rendering the App component into the root div defined in public/index.html
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
