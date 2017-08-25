import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

firebase.initializeApp({
  apiKey: "wololo",
  authDomain: "wololo.firebaseapp.com",
  databaseURL: "https://wololo.firebaseio.com",
  projectId: "pseudogram-wololo",
  storageBucket: "wololo.appspot.com",
  messagingSenderId: "wololo"
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
