import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './store';
import {ProtectedRoute, ProvideAuth} from './Auth';

import Login from './page/Login';
import Todo from './page/Todo';

const App = () => {
  return (
    <ProvideAuth>
      <Provider store={store}>
        <Router>
          <div>
            <Switch>
              <Route path="/login">
                <Login/>
              </Route>
              <ProtectedRoute path="/">
                <Todo/>
              </ProtectedRoute>
            </Switch>
          </div>
        </Router>
      </Provider>
    </ProvideAuth>
  );
};

export default App;
