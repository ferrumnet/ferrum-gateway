import React from 'react';
import { StoreBuilder } from 'common-containers';
import './app.scss';
import { Dashboard } from './pages/Dashboard';
import { dataReducer, uiReducer, userReducer } from './common/Reducer';
import { BrowserRouter as Router } from 'react-router-dom';
import { GovernanceModule } from './common/GovernanceModule';
import { Environment } from 'types';

const _module = new GovernanceModule();
const store = StoreBuilder.build(
            userReducer, dataReducer, uiReducer, _module, Environment.defaultEndPoint());
            // "https://22phwrgczz.us-east-2.awsapprunner.com");

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
