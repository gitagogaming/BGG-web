import React from 'react';
import ReactDOM from 'react-dom/client';

import { CurrentGameConfigProvider } from './context/currentGameConfig';


import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <React.StrictMode>
    <CurrentGameConfigProvider>
      <App />
    </CurrentGameConfigProvider>
  </React.StrictMode>
);
