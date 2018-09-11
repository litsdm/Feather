import * as React from 'react';
import { object, node } from 'prop-types';
import { withRouter } from 'react-router';

import AppHeader from '../components/AppHeader';

// history(prop).push('/auth');

const App = ({ children, location: { pathname } }) => (
  <React.Fragment>
    {pathname !== '/auth' ? <AppHeader /> : null}
    {children}
  </React.Fragment>
);

App.propTypes = {
  children: node.isRequired,
  location: object.isRequired // eslint-disable-line react/forbid-prop-types
};

export default withRouter(App);
