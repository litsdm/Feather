import * as React from 'react';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import jwtDecode from 'jwt-decode';
import { arrayOf, bool, func, object, node, number, string } from 'prop-types';
import { userShape, friendRequestShape, fileShape } from '../shapes';
import socket, { emit } from '../socketClient';

import notify from '../helpers/notifications';

import { fetchFilesIfNeeded, addFile, removeFile } from '../actions/file';
import { finishDownload, updateDownloadProgress } from '../actions/download';
import { stopWaiting, uploadWithSend } from '../actions/upload';
import { fetchFriendsIfNeeded } from '../actions/friend';
import {
  fetchFriendRequestsIfNeeded,
  addFriendRequest
} from '../actions/friendRequest';

import NavBar from '../components/NavBar';
import SendPopUp from '../components/SendPopUp';
import UploadQueue from '../components/UploadQueue';

const mapStateToProps = ({
  upload: { isWaiting, queue, file, progress },
  user,
  friend: { friends },
  friendRequest: { friendRequests }
}) => ({
  isWaiting,
  userId: user.id,
  friends,
  friendRequests,
  queue,
  uploadFile: file,
  uploadProgress: progress
});

const mapDispatchToProps = dispatch => ({
  fetchFiles: () => dispatch(fetchFilesIfNeeded()),
  fetchFriends: () => dispatch(fetchFriendsIfNeeded()),
  fetchFriendRequests: () => dispatch(fetchFriendRequestsIfNeeded()),
  dFinishDownload: fileId => dispatch(finishDownload(fileId)),
  dUpdateDownloadProgress: (fileId, progress) =>
    dispatch(updateDownloadProgress(fileId, progress)),
  dAddFile: file => dispatch(addFile(file)),
  dRemoveFile: index => dispatch(removeFile(index)),
  dStopWaiting: () => dispatch(stopWaiting()),
  uploadFiles: send => dispatch(uploadWithSend(send)),
  addReceivedFriendRequest: friendRequest =>
    dispatch(addFriendRequest(friendRequest))
});

class App extends React.Component {
  state = {
    user: null
  };

  componentDidMount() {
    const {
      history,
      location: { pathname },
      fetchFiles,
      fetchFriends,
      fetchFriendRequests
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
      fetchFriends();
      fetchFriendRequests();
    }

    this.setupListeners();
  }

  setupListeners = () => {
    const { dAddFile, dRemoveFile, addReceivedFriendRequest } = this.props;
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
    socket.on('receiveFriendRequest', friendRequest => {
      addReceivedFriendRequest(friendRequest);

      notify({
        title: `${friendRequest.from.username} sent a friend request!`,
        body: 'You can see this request on your friends page.'
      });
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
      uploadFiles,
      friends,
      friendRequests,
      userId,
      queue,
      uploadFile,
      uploadProgress
    } = this.props;
    return (
      <React.Fragment>
        {pathname !== '/settings' && pathname !== '/auth' ? (
          <NavBar
            pathname={pathname}
            history={history}
            requestIndicator={friendRequests.length > 0}
          />
        ) : null}
        {children}
        <SendPopUp
          display={isWaiting}
          stopWaiting={dStopWaiting}
          uploadFiles={uploadFiles}
          userId={userId}
          friends={friends}
        />
        <UploadQueue
          queue={queue}
          file={uploadFile}
          progress={uploadProgress}
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
  uploadFiles: func.isRequired,
  fetchFriends: func.isRequired,
  fetchFriendRequests: func.isRequired,
  addReceivedFriendRequest: func.isRequired,
  friends: arrayOf(userShape),
  friendRequests: arrayOf(friendRequestShape),
  userId: string,
  queue: arrayOf(fileShape),
  uploadFile: fileShape,
  uploadProgress: number
};

App.defaultProps = {
  friends: [],
  friendRequests: [],
  userId: '',
  queue: [],
  uploadFile: null,
  uploadProgress: 0
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
