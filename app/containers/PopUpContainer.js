import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';
import { userShape } from '../shapes';

import { finishSelectingRecipients, stopWaiting } from '../actions/queue';
import { uploadToLink } from '../actions/upload';
import { hideUpgrade } from '../actions/upgrade';

import SendPopUp from '../components/SendPopUp';
import DisconnectedModal from '../components/DisconnectedModal';
import UpgradeModal from '../components/UpgradeModal';
import LinkProgress from '../components/LinkProgress';
import LinkModal from '../components/LinkModal';

const mapStateToProps = ({
  queue: { isWaiting },
  upload: { isSending, status, statusProgress, linkUrl },
  file: { failed, isFetching: isFetchingFiles },
  friend: { friends },
  upgrade,
  user
}) => ({
  isWaiting,
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
  uploadFiles: (send, addToUser) =>
    dispatch(finishSelectingRecipients(send, addToUser)),
  uploadLink: send => dispatch(uploadToLink(send)),
  closeUpgrade: () => dispatch(hideUpgrade())
});

const PopUpContainer = ({
  isWaiting,
  dStopWaiting,
  uploadFiles,
  friends,
  user,
  uploadLink,
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
  user: userShape,
  failed: bool.isRequired,
  isFetchingFiles: bool.isRequired,
  linkUrl: string.isRequired,
  upgrade: shape({ visible: bool, messageType: string }).isRequired
};

PopUpContainer.defaultProps = {
  friends: [],
  isSending: false,
  status: '',
  statusProgress: 0,
  user: {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopUpContainer);
