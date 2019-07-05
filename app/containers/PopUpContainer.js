import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { arrayOf, bool, func, shape, string } from 'prop-types';
import { userShape } from '../shapes';

import {
  finishSelectingRecipients,
  stopWaiting,
  uploadToLink
} from '../actions/queue';
import { hideUpgrade } from '../actions/upgrade';

import SendModal from '../components/SendModal';
import DisconnectedModal from '../components/DisconnectedModal';
import UpgradeModal from '../components/UpgradeModal';
import LinkModal from '../components/LinkModal';
import ModalLoader from '../components/ModalLoader';

const mapStateToProps = ({
  queue: { isWaiting, linkUrl },
  file: { failed, isFetching: isFetchingFiles },
  friend: { friends },
  upgrade,
  user,
  loading
}) => ({
  isWaiting,
  linkUrl,
  upgrade,
  user,
  failed,
  isFetchingFiles,
  friends,
  isLoading: loading
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
  linkUrl,
  fetchData,
  isLoading
}) => (
  <Fragment>
    <ModalLoader display={isLoading} />
    <SendModal
      display={isWaiting}
      stopWaiting={dStopWaiting}
      friends={friends}
      userID={user.id}
      uploadFiles={uploadFiles}
      uploadLink={uploadLink}
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
  friends: arrayOf(userShape),
  user: userShape,
  failed: bool.isRequired,
  isFetchingFiles: bool.isRequired,
  linkUrl: string.isRequired,
  isLoading: bool.isRequired,
  upgrade: shape({ visible: bool, messageType: string }).isRequired
};

PopUpContainer.defaultProps = {
  friends: [],
  user: {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopUpContainer);
