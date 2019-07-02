import React from 'react';
import { connect } from 'react-redux';
import { arrayOf, bool, func, string } from 'prop-types';
import { fileShape } from '../shapes';

import Home from '../components/Home';

import { removeFile } from '../actions/file';
import { downloadFile } from '../actions/download';
import { awaitRecipients } from '../actions/queue';

const mapStateToProps = ({ file: { files, isFetching }, user }) => ({
  files,
  userId: user.id,
  isFetching
});

const mapDispatchToProps = dispatch => ({
  dDownloadFile: (fileId, url, filename) =>
    dispatch(downloadFile(fileId, url, filename)),
  dRemoveFile: index => dispatch(removeFile(index)),
  waitForRecipients: files => dispatch(awaitRecipients(files))
});

const HomePage = ({
  files,
  userId,
  isFetching,
  dDownloadFile,
  dRemoveFile,
  waitForRecipients
}) => (
  <Home
    files={files}
    userId={userId}
    isFetching={isFetching}
    downloadFile={dDownloadFile}
    removeFile={dRemoveFile}
    awaitSendForFiles={waitForRecipients}
  />
);

HomePage.propTypes = {
  files: arrayOf(fileShape).isRequired,
  userId: string.isRequired,
  isFetching: bool.isRequired,
  dDownloadFile: func.isRequired,
  dRemoveFile: func.isRequired,
  waitForRecipients: func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
