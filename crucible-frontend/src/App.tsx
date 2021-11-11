import React from 'react';
import { StoreBuilder } from 'common-containers';
import "./assets/css/icons.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/scss/styles.scss";
// import './App.css';
import { Dashboard } from './pages/Dashboard';
import { dataReducer, uiReducer, userReducer } from './common/Reducer';
import { BrowserRouter as Router } from 'react-router-dom';
import { CrucibleModule } from './common/CrucibleModule';
import { TransactionListProvider } from 'common-containers/dist/chain/TransactionList';
import { APPLICATION_NAME } from './common/CommonActions';
import { Environment } from 'types';

const _module = new CrucibleModule();
const store = StoreBuilder.build(
            userReducer, dataReducer, uiReducer, _module, Environment.defaultEndPoint());

function App() {
  return (
    <StoreBuilder.Provider store={store}>
			<TransactionListProvider application={APPLICATION_NAME} />
      <Router>
        <Dashboard />
      </Router>
    </StoreBuilder.Provider>
  );
}

export default App;
