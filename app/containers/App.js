import * as React from 'react';
import { ipcRenderer } from 'electron';
import { bool, func, object, node } from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import jwtDecode from 'jwt-decode';
import socket, { emit } from '../socketClient';

import notify from '../helpers/notifications';

import { fetchFilesIfNeeded, addFile, removeFile } from '../actions/file';
import { finishDownload, updateDownloadProgress } from '../actions/download';
import { stopWaiting, uploadWithSend } from '../actions/upload';

import NavBar from '../components/NavBar';
import SendPopUp from '../components/SendPopUp';

const tempFriends = [
  {
    _id: '1',
    name: 'Carlos Diez',
    placeholderColor: '#FF5252'
  },
  {
    _id: '2',
    name: 'Pamela Aridjis',
    placeholderColor: '#FFC107'
  },
  {
    _id: '3',
    name: 'Mikeldi Moran',
    placeholderColor: '#607D8B'
  }
];

const mapStateToProps = ({ upload: { isWaiting }, user }) => ({
  isWaiting,
  userId: user.id
});

const mapDispatchToProps = dispatch => ({
  fetchFiles: () => dispatch(fetchFilesIfNeeded()),
  dFinishDownload: fileId => dispatch(finishDownload(fileId)),
  dUpdateDownloadProgress: (fileId, progress) =>
    dispatch(updateDownloadProgress(fileId, progress)),
  dAddFile: file => dispatch(addFile(file)),
  dRemoveFile: index => dispatch(removeFile(index)),
  dStopWaiting: () => dispatch(stopWaiting()),
  dUploadWithSend: send => dispatch(uploadWithSend(send))
});

class App extends React.Component {
  state = {
    user: null
  };

  componentDidMount() {
    const {
      history,
      location: { pathname },
      fetchFiles
    } = this.props;
    const { user } = this.state;
    const token = localStorage.getItem('tempoToken');
    const localConfig = localStorage.getItem('localConfig');

    if (!localConfig)
      localStorage.setItem(
        'localConfig',
        JSON.stringify({
          notifyUpload: true,
          notifyRecieve: true,
          notifyDownload: true
        })
      );

    if (!user && !token && pathname !== '/auth') history.push('/auth');

    if (user || token) {
      const userId = user ? user.id : jwtDecode(token).id;
      emit('userConnection', userId);
      fetchFiles();
    }

    this.setupListeners();
  }

  setupListeners = () => {
    const { dAddFile, dRemoveFile } = this.props;
    const localConfig = JSON.parse(localStorage.getItem('localConfig'));

    ipcRenderer.on('download-progress', this.handleDownloadProgress);
    ipcRenderer.on('download-finish', this.handleDownloadFinish);
    socket.on('recieveFile', file => {
      dAddFile(file);

      if (localConfig.notifyReceived) {
        notify({
          title: 'File Recieved',
          body: `You can now download ${file.name} on this device.`
        });
      }
    });
    socket.on('removeFile', index => {
      dRemoveFile(index);
    });
  };

  handleDownloadProgress = (e, { progress, fileId }) => {
    const { dUpdateDownloadProgress } = this.props;
    dUpdateDownloadProgress(fileId, progress);
  };

  handleDownloadFinish = (e, { fileId, filename }) => {
    const { dFinishDownload } = this.props;
    const localConfig = JSON.parse(localStorage.getItem('localConfig'));

    dFinishDownload(fileId);

    if (localConfig.notifyDownload) {
      notify({
        title: 'Download Complete',
        body: `${filename} has finished downloading.`
      });
    }
  };

  render() {
    const {
      children,
      location: { pathname },
      history,
      isWaiting,
      dStopWaiting,
      dUploadWithSend
    } = this.props;
    return (
      <React.Fragment>
        {pathname !== '/settings' && pathname !== '/auth' ? (
          <NavBar pathname={pathname} history={history} />
        ) : null}
        {children}
        <SendPopUp
          display={isWaiting}
          stopWaiting={dStopWaiting}
          uploadWithSend={dUploadWithSend}
          friends={tempFriends}
        />
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
  dAddFile: func.isRequired,
  dRemoveFile: func.isRequired,
  isWaiting: bool.isRequired,
  dStopWaiting: func.isRequired,
  dUploadWithSend: func.isRequired
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
