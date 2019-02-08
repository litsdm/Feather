import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import HomePage from './containers/HomePage';
import AuthPage from './containers/AuthPage';
import SettingsPage from './containers/SettingsPage';
import FriendsPage from './containers/FriendsPage';

export default () => (
  <App>
    <Switch>
      <Route path={routes.HOME} component={HomePage} exact />
      <Route path={routes.AUTH} component={AuthPage} />
      <Route path={routes.SETTINGS} component={SettingsPage} />
      <Route path={routes.FRIENDS} component={FriendsPage} />
    </Switch>
  </App>
);
