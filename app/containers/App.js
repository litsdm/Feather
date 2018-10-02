import * as React from 'react';
import { ipcRenderer } from 'electron';
import { func, object, node } from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import jwtDecode from 'jwt-decode';
import socket, { emit } from '../socketClient';

import { fetchFilesIfNeeded, addFile } from '../actions/file'
import { finishDownload, updateDownloadProgress } from '../actions/download';

import AppHeader from '../components/AppHeader';

const mapDispatchToProps = dispatch => ({
  fetchFiles: () => dispatch(fetchFilesIfNeeded()),
  dFinishDownload: fileId => dispatch(finishDownload(fileId)),
  dUpdateDownloadProgress: (fileId, progress) => dispatch(updateDownloadProgress(fileId, progress)),
  dAddFile: file => dispatch(addFile(file))
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

    if (user || token) {
      const userId = user ? user.id : jwtDecode(token).id;
      emit('connectUser', userId);
      fetchFiles();
    }

    this.setupListeners();
  }

  setupListeners = () => {
    const { dAddFile } = this.props;

    ipcRenderer.on('download-progress', this.handleDownloadProgress);
    ipcRenderer.on('download-finish', this.handleDownloadFinish);
    socket.on('recieveFile', (file) => {
      dAddFile(file);
    });
  }

  handleDownloadProgress = (e, { progress, fileId }) => {
    const { dUpdateDownloadProgress } = this.props;
    dUpdateDownloadProgress(fileId, progress);
  }

  handleDownloadFinish = (e, { fileId }) => {
    const { dFinishDownload } = this.props;
    dFinishDownload(fileId)
  }

  render() {
    const { children, location: { pathname } } = this.props;
    return (
      <React.Fragment>
        {pathname === '/' ? <AppHeader /> : null}
        {children}
      </React.Fragment>
    );
  }
}

App.propTypes = {
  children: node.isRequired,
  location: object.isRequired, // eslint-disable-line react/forbid-prop-types
  history: object.isRequired, // eslint-disable-line react/forbid-prop-types
  fetchFiles: func.isRequired,
  dFinishDownload: func.isRequired,
  dUpdateDownloadProgress: func.isRequired,
  dAddFile: func.isRequired
};

export default withRouter(connect(null, mapDispatchToProps)(App));
