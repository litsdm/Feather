import * as React from 'react';
import { object, node } from 'prop-types';
import { withRouter } from 'react-router';

import AppHeader from '../components/AppHeader';

class App extends React.Component {
  state = {
    user: null
  }

  componentDidMount() {
    const { history, location: { pathname } } = this.props;
    const { user } = this.state;
    const token = localStorage.getItem('tempoToken');

    if (!user && !token && pathname !== '/auth') history.push('/auth');
  }

  render() {
    const { children, location: { pathname } } = this.props;
    return (
      <React.Fragment>
        {pathname !== '/auth' ? <AppHeader /> : null}
        {children}
      </React.Fragment>
    );
  }
}

App.propTypes = {
  children: node.isRequired,
  location: object.isRequired, // eslint-disable-line react/forbid-prop-types
  history: object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withRouter(App);
