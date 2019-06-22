import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import jwtDecode from 'jwt-decode';
import { arrayOf, func, object, node } from 'prop-types';
import { friendRequestShape, userShape } from '../shapes';
import socket, { emit } from '../socketClient';

import notify from '../helpers/notifications';
import useDropzone from '../helpers/useDropzone';

import { fetchFilesIfNeeded, addFile, removeFile } from '../actions/file';
import { finishDownload, updateDownloadProgress } from '../actions/download';
import { awaitSendForFiles } from '../actions/upload';
import { fetchFriendsIfNeeded, addFriend } from '../actions/friend';
import {
  fetchFriendRequestsIfNeeded,
  addFriendRequest
} from '../actions/friendRequest';
import { addUserFromToken } from '../actions/user';

import NavBar from '../components/NavBar';
import PopUpContainer from './PopUpContainer';
import DropOverlay from '../components/DropOverlay';

const mapStateToProps = ({ user, friendRequest: { friendRequests } }) => ({
  user,
  friendRequests
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
  addReceivedFriendRequest: friendRequest =>
    dispatch(addFriendRequest(friendRequest)),
  waitForRecipients: files => dispatch(awaitSendForFiles(files)),
  addNewFriend: friend => dispatch(addFriend(friend)),
  updateUser: token => dispatch(addUserFromToken(token))
});

const App = ({
  addNewFriend,
  addReceivedFriendRequest,
  children,
  dAddFile,
  dFinishDownload,
  dRemoveFile,
  dUpdateDownloadProgress,
  fetchFiles,
  fetchFriends,
  fetchFriendRequests,
  friendRequests,
  history,
  location: { pathname },
  updateUser,
  user,
  waitForRecipients
}) => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const isDragging = useDropzone();

  // component did mount equivalent (runs once)
  useEffect(() => {
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

    if (
      !Object.prototype.hasOwnProperty.call(user, 'id') &&
      !token &&
      pathname !== '/auth'
    ) {
      history.push('/auth');
    }

    if (Object.prototype.hasOwnProperty.call(user, 'id') || token) {
      const userId = user ? user.id : jwtDecode(token).id;
      emit('userConnection', userId);
      fetchData();
    }

    setupListeners();
  }, []);

  const fetchData = () => {
    fetchFiles();
    fetchFriends();
    fetchFriendRequests();
  };

  const setupListeners = () => {
    const localConfig = JSON.parse(localStorage.getItem('localConfig'));

    ipcRenderer.on('download-progress', handleDownloadProgress);
    ipcRenderer.on('download-finish', handleDownloadFinish);
    ipcRenderer.on('upload-from-tray', handleTrayUpload);
    ipcRenderer.on('updateReady', () => setUpdateAvailable(true));
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

  const handleTrayUpload = (e, files) => waitForRecipients(files);
  const handleDownloadProgress = (e, { progress, fileId }) =>
    dUpdateDownloadProgress(fileId, progress);

  const handleDownloadFinish = (e, { fileId, filename }) => {
    const localConfig = JSON.parse(localStorage.getItem('localConfig'));

    dFinishDownload(fileId);

    if (localConfig.notifyDownload) {
      notify({
        title: 'Download Complete',
        body: `${filename} has finished downloading.`
      });
    }
  };

  console.log(isDragging);

  return (
    <>
      {pathname !== '/settings' && pathname !== '/auth' ? (
        <NavBar
          pathname={pathname}
          history={history}
          requestIndicator={friendRequests.length > 0}
          updateAvailable={updateAvailable}
        />
      ) : null}
      {children}
      <PopUpContainer fetchData={fetchData} />
      <DropOverlay visible={isDragging} />
    </>
  );
};

App.propTypes = {
  children: node.isRequired,
  location: object.isRequired, // eslint-disable-line react/forbid-prop-types
  history: object.isRequired, // eslint-disable-line react/forbid-prop-types
  fetchFiles: func.isRequired,
  dFinishDownload: func.isRequired,
  dUpdateDownloadProgress: func.isRequired,
  dAddFile: func.isRequired,
  dRemoveFile: func.isRequired,
  fetchFriends: func.isRequired,
  updateUser: func.isRequired,
  fetchFriendRequests: func.isRequired,
  addReceivedFriendRequest: func.isRequired,
  waitForRecipients: func.isRequired,
  addNewFriend: func.isRequired,
  friendRequests: arrayOf(friendRequestShape),
  user: userShape
};

App.defaultProps = {
  friendRequests: [],
  user: {}
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(App)
);
