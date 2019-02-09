import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';
import { userShape, fileShape } from '../shapes';

import { stopWaiting, uploadWithSend, uploadToLink } from '../actions/upload';
import { hideUpgrade } from '../actions/upgrade';

import SendPopUp from '../components/SendPopUp';
import UploadQueue from '../components/UploadQueue';
import DisconnectedModal from '../components/DisconnectedModal';
import UpgradeModal from '../components/UpgradeModal';
import LinkProgress from '../components/LinkProgress';
import LinkModal from '../components/LinkModal';

const mapStateToProps = ({
  upload: {
    isWaiting,
    queue,
    file,
    progress,
    isSending,
    status,
    statusProgress,
    linkUrl
  },
  file: { failed, isFetching: isFetchingFiles },
  friend: { friends },
  upgrade,
  user
}) => ({
  queue,
  isWaiting,
  uploadFile: file,
  uploadProgress: progress,
  isSending,
  status,
  statusProgress,
  linkUrl,
  upgrade,
  user,
  failed,
  isFetchingFiles,
  friends
});

const mapDispatchToProps = dispatch => ({
  dStopWaiting: () => dispatch(stopWaiting()),
  uploadFiles: (send, addToUser) => dispatch(uploadWithSend(send, addToUser)),
  uploadLink: send => dispatch(uploadToLink(send)),
  closeUpgrade: () => dispatch(hideUpgrade())
});

const PopUpContainer = ({
  isWaiting,
  dStopWaiting,
  uploadFiles,
  friends,
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
  statusProgress,
  linkUrl,
  fetchData
}) => (
  <Fragment>
    <SendPopUp
      display={isWaiting}
      stopWaiting={dStopWaiting}
      uploadFiles={uploadFiles}
      uploadLink={uploadLink}
      user={user}
      friends={[{ ...user, _id: user.id }, ...friends]}
    />
    <UploadQueue queue={queue} file={uploadFile} progress={uploadProgress} />
    <LinkProgress
      visible={isSending}
      status={status}
      progress={statusProgress}
    />
    <LinkModal url={linkUrl} />
    {upgrade.visible ? (
      <UpgradeModal
        type={upgrade.messageType}
        close={closeUpgrade}
        remainingBytes={user.remainingBytes || 0}
      />
    ) : null}
    {failed ? (
      <DisconnectedModal retry={fetchData} isFetching={isFetchingFiles} />
    ) : null}
  </Fragment>
);

PopUpContainer.propTypes = {
  isWaiting: bool.isRequired,
  dStopWaiting: func.isRequired,
  uploadFiles: func.isRequired,
  fetchData: func.isRequired,
  closeUpgrade: func.isRequired,
  uploadLink: func.isRequired,
  isSending: bool,
  status: string,
  statusProgress: number,
  friends: arrayOf(userShape),
  queue: arrayOf(fileShape),
  uploadFile: fileShape,
  uploadProgress: number,
  user: userShape,
  failed: bool.isRequired,
  isFetchingFiles: bool.isRequired,
  linkUrl: string.isRequired,
  upgrade: shape({ visible: bool, messageType: string }).isRequired
};

PopUpContainer.defaultProps = {
  friends: [],
  queue: [],
  isSending: false,
  status: '',
  statusProgress: 0,
  uploadFile: null,
  uploadProgress: 0,
  user: {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopUpContainer);
