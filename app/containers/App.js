import * as React from 'react';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import jwtDecode from 'jwt-decode';
import {
  arrayOf,
  bool,
  func,
  object,
  node,
  number,
  shape,
  string
} from 'prop-types';
import { userShape, friendRequestShape, fileShape } from '../shapes';
import socket, { emit } from '../socketClient';

import notify from '../helpers/notifications';

import { fetchFilesIfNeeded, addFile, removeFile } from '../actions/file';
import { finishDownload, updateDownloadProgress } from '../actions/download';
import {
  stopWaiting,
  uploadWithSend,
  awaitSendForFiles,
  uploadToLink
} from '../actions/upload';
import { fetchFriendsIfNeeded, addFriend } from '../actions/friend';
import {
  fetchFriendRequestsIfNeeded,
  addFriendRequest
} from '../actions/friendRequest';
import { addUserFromToken } from '../actions/user';
import { hideUpgrade } from '../actions/upgrade';

import NavBar from '../components/NavBar';
import SendPopUp from '../components/SendPopUp';
import UploadQueue from '../components/UploadQueue';
import DisconnectedModal from '../components/DisconnectedModal';
import UpgradeModal from '../components/UpgradeModal';
import LinkProgress from '../components/LinkProgress';

const mapStateToProps = ({
  upload: {
    isWaiting,
    queue,
    file,
    progress,
    isSending,
    status,
    statusProgress
  },
  user,
  friend: { friends },
  friendRequest: { friendRequests },
  file: { failed, isFetching: isFetchingFiles },
  upgrade
}) => ({
  isWaiting,
  user,
  friends,
  friendRequests,
  queue,
  uploadFile: file,
  uploadProgress: progress,
  failed,
  isFetchingFiles,
  upgrade,
  isSending,
  status,
  statusProgress
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
  uploadFiles: (send, addToUser) => dispatch(uploadWithSend(send, addToUser)),
  uploadLink: send => dispatch(uploadToLink(send)),
  addReceivedFriendRequest: friendRequest =>
    dispatch(addFriendRequest(friendRequest)),
  waitForRecipients: files => dispatch(awaitSendForFiles(files)),
  addNewFriend: friend => dispatch(addFriend(friend)),
  updateUser: token => dispatch(addUserFromToken(token)),
  closeUpgrade: () => dispatch(hideUpgrade())
});

class App extends React.Component {
  state = {
    user: null,
    updateAvailable: false
  };

  componentDidMount() {
    const {
      history,
      location: { pathname }
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
      this.fetchData();
    }

    this.setupListeners();
  }

  fetchData = () => {
    const { fetchFiles, fetchFriends, fetchFriendRequests } = this.props;
    fetchFiles();
    fetchFriends();
    fetchFriendRequests();
  };

  setupListeners = () => {
    const {
      dAddFile,
      dRemoveFile,
      addReceivedFriendRequest,
      addNewFriend,
      updateUser
    } = this.props;
    const localConfig = JSON.parse(localStorage.getItem('localConfig'));

    ipcRenderer.on('download-progress', this.handleDownloadProgress);
    ipcRenderer.on('download-finish', this.handleDownloadFinish);
    ipcRenderer.on('upload-from-tray', this.handleTrayUpload);
    ipcRenderer.on('updateReady', () =>
      this.setState({ updateAvailable: true })
    );
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
    socket.on('newFriend', friend => {
      addNewFriend(friend);
    });
    socket.on('receiveFriendRequest', friendRequest => {
      addReceivedFriendRequest(friendRequest);

      notify({
        title: `${friendRequest.from.username} sent a friend request!`,
        body: 'You can see this request on your friends page.'
      });
    });
    socket.on('updateUser', token => {
      updateUser(token);
    });
  };

  handleTrayUpload = (e, files) => {
    const { waitForRecipients } = this.props;
    waitForRecipients(files);
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
      user,
      queue,
      uploadFile,
      uploadLink,
      uploadProgress,
      failed,
      isFetchingFiles,
      upgrade,
      closeUpgrade,
      isSending,
      status,
      statusProgress
    } = this.props;
    const { updateAvailable } = this.state;
    return (
      <React.Fragment>
        {pathname !== '/settings' && pathname !== '/auth' ? (
          <NavBar
            pathname={pathname}
            history={history}
            requestIndicator={friendRequests.length > 0}
            updateAvailable={updateAvailable}
          />
        ) : null}
        {children}
        <SendPopUp
          display={isWaiting}
          stopWaiting={dStopWaiting}
          uploadFiles={uploadFiles}
          uploadLink={uploadLink}
          user={user}
          friends={[{ ...user, _id: user.id }, ...friends]}
        />
        <UploadQueue
          queue={queue}
          file={uploadFile}
          progress={uploadProgress}
        />
        <LinkProgress
          visible={isSending}
          status={status}
          progress={statusProgress}
        />
        {upgrade.visible ? (
          <UpgradeModal
            type={upgrade.messageType}
            close={closeUpgrade}
            remainingBytes={user.remainingBytes || 0}
          />
        ) : null}
        {failed ? (
          <DisconnectedModal
            retry={this.fetchData}
            isFetching={isFetchingFiles}
          />
        ) : null}
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
  updateUser: func.isRequired,
  closeUpgrade: func.isRequired,
  fetchFriendRequests: func.isRequired,
  addReceivedFriendRequest: func.isRequired,
  waitForRecipients: func.isRequired,
  addNewFriend: func.isRequired,
  uploadLink: func.isRequired,
  isSending: bool,
  status: string,
  statusProgress: number,
  friends: arrayOf(userShape),
  friendRequests: arrayOf(friendRequestShape),
  queue: arrayOf(fileShape),
  uploadFile: fileShape,
  uploadProgress: number,
  user: userShape,
  failed: bool.isRequired,
  isFetchingFiles: bool.isRequired,
  upgrade: shape({ visible: bool, messageType: string }).isRequired
};

App.defaultProps = {
  friends: [],
  friendRequests: [],
  queue: [],
  isSending: false,
  status: '',
  statusProgress: 0,
  uploadFile: null,
  uploadProgress: 0,
  user: {}
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
