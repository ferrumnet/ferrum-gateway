import React from 'react';
import { StoreBuilder } from 'common-containers';
import './App.css';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { BridgeModule } from './common/BridgeModule';
import { dataReducer, uiReducer, userReducer } from './common/Reducer';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastProvider, useToasts } from 'react-toast-notifications';

const _module = new BridgeModule();
const BASE_URL = 'http://localhost:8080';
const store = StoreBuilder.build(
            userReducer, dataReducer, uiReducer, _module, BASE_URL);

function App() {
  return (
    <StoreBuilder.Provider store={store}>
      <ToastProvider>
        <Router>
          <Dashboard />
        </Router>
      </ToastProvider>

    </StoreBuilder.Provider>
  );
}

export default App;