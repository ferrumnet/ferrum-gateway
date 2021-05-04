import React from 'react';
import { StoreBuilder } from 'common-containers';
import './App.css';
import { Dashboard } from './pages/Dashboard';
import { GatewayModule } from './common/GatewayModule';
import { dataReducer, uiReducer, userReducer } from './common/Reducer';
import { BrowserRouter as Router } from 'react-router-dom';

const _module = new GatewayModule();
const BASE_URL = 'http://localhost:8080';
const store = StoreBuilder.build(
            userReducer, dataReducer, uiReducer, _module, BASE_URL);

function App() {
  return (
    <StoreBuilder.Provider store={store}>
      <Router>
        <Dashboard />
      </Router>
    </StoreBuilder.Provider>
  );
}

export default App;
