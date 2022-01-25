import React from 'react';
import { StoreBuilder } from 'common-containers';
import "./assets/css/icons.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/scss/styles.scss";
// import './App.css';
import { Dashboard } from './pages/main/Dashboard';
import { dataReducer, uiReducer, userReducer } from './common/Reducer';
import { BrowserRouter as Router } from 'react-router-dom';
import { CrucibleModule } from './common/CrucibleModule';
import { TransactionListProvider } from 'common-containers/dist/chain/TransactionList';
import { APPLICATION_NAME } from './common/CommonActions';
import { Environment } from 'types';
import { ToastProvider, useToasts } from 'react-toast-notifications';

const _module = new CrucibleModule();
const store = StoreBuilder.build(
            userReducer, dataReducer, uiReducer, _module, 
            //Environment.defaultEndPoint(),
            'https://4ikenxgwge.execute-api.us-east-2.amazonaws.com/default/kb-staging-backend',
            );

function App() {
  return (
    <StoreBuilder.Provider store={store}>
        <TransactionListProvider application={APPLICATION_NAME} />
        <ToastProvider placement='top-center' >
          <Router>
            <Dashboard />
          </Router>
        </ToastProvider>
    </StoreBuilder.Provider>
  );
}

export default App;
