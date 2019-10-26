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
import { fetchRecentEmailsIfNeeded, setRecentEmails } from '../actions/user';

import SendModal from '../components/SendModal';
import DisconnectedModal from '../components/DisconnectedModal';
import UpgradeModal from '../components/UpgradeModal';
import LinkModal from '../components/LinkModal';
import ModalLoader from '../components/ModalLoader';

const mapStateToProps = ({
  queue: { isWaiting, linkUrl, onlyLink },
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
  onlyLink,
  failed,
  isFetchingFiles,
  friends,
  isLoading: loading
});

const mapDispatchToProps = dispatch => ({
  dStopWaiting: () => dispatch(stopWaiting()),
  uploadFiles: (send, addToUser) =>
    dispatch(finishSelectingRecipients(send, addToUser)),
  uploadLink: (send, onlyLink = false) =>
    dispatch(uploadToLink(send, onlyLink)),
  updateRecentEmails: usedEmails => dispatch(setRecentEmails(usedEmails)),
  fetchRecentEmails: () => dispatch(fetchRecentEmailsIfNeeded()),
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
  isLoading,
  onlyLink,
  fetchRecentEmails,
  updateRecentEmails
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
      recentEmails={user.recentEmails}
      fetchRecentEmails={fetchRecentEmails}
      updateRecentEmails={updateRecentEmails}
    />
    <LinkModal url={linkUrl} onlyLink={onlyLink} />
    {upgrade.visible ? (
      <UpgradeModal type={upgrade.messageType} close={closeUpgrade} />
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
  onlyLink: bool.isRequired,
  upgrade: shape({ visible: bool, messageType: string }).isRequired,
  fetchRecentEmails: func.isRequired,
  updateRecentEmails: func.isRequired
};

PopUpContainer.defaultProps = {
  friends: [],
  user: {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopUpContainer);
