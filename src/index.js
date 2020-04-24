import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from '@reach/router';

import Header from './Header';
import Home from './Home';
import NotFound from './NotFound';
import * as serviceWorker from './serviceWorker';
import './tailwind.generated.css';

const Root = ({ children }) => (
  <>
    <Header />
    {children}
    <footer className="bg-purple-100 text-gray-800 p-6">
      <p className="text-center text-xs">&copy;2020 Made by Zsolt Meszaros</p>
    </footer>
  </>
);
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Root path="/">
        <Home path="/" />
        <NotFound default />
      </Root>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
