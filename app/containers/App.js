import * as React from 'react';
import { func, object, node } from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { fetchFilesIfNeeded } from '../actions/file'

import AppHeader from '../components/AppHeader';

const mapDispatchToProps = dispatch => ({
  fetchFiles: () => dispatch(fetchFilesIfNeeded())
});

class App extends React.Component {
  state = {
    user: null
  }

  componentDidMount() {
    const { history, location: { pathname }, fetchFiles } = this.props;
    const { user } = this.state;
    const token = localStorage.getItem('tempoToken');

    if (!user && !token && pathname !== '/auth') history.push('/auth');

    if (user || token) fetchFiles();
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
  fetchFiles: func.isRequired
};

export default withRouter(connect(null, mapDispatchToProps)(App));
