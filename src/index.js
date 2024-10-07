import React from 'react';
import ReactDOM from 'react-dom/client';

import { CurrentGameConfigProvider } from './context/currentGameConfig';
import { MatchDataProvider } from './context/MatchDataContext';
import { AppProvider } from './context/AppContext';


import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <React.StrictMode>

    <MatchDataProvider>
      <CurrentGameConfigProvider>
        <AppProvider>
          <App />
        </AppProvider>
      </CurrentGameConfigProvider>
    </MatchDataProvider>
  </React.StrictMode>
);
