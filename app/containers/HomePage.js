import React from 'react';
import { connect } from 'react-redux';
import { arrayOf, bool, func, number, object, string } from 'prop-types';
import { fileShape } from '../shapes';

import Home from '../components/Home';

import { removeFile } from '../actions/file';
import { awaitRecipients, downloadFile } from '../actions/queue';

const mapStateToProps = ({
  file: { files, isFetching },
  user,
  queue: { files: queueFiles, completedCount }
}) => ({
  files,
  queueFiles,
  userId: user.id,
  isFetching,
  completedCount
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
  waitForRecipients,
  queueFiles,
  completedCount
}) => (
  <Home
    files={files}
    userId={userId}
    isFetching={isFetching}
    downloadFile={dDownloadFile}
    removeFile={dRemoveFile}
    awaitSendForFiles={waitForRecipients}
    queueFiles={queueFiles}
    completedCount={completedCount}
  />
);

HomePage.propTypes = {
  files: arrayOf(fileShape).isRequired,
  userId: string.isRequired,
  isFetching: bool.isRequired,
  dDownloadFile: func.isRequired,
  dRemoveFile: func.isRequired,
  waitForRecipients: func.isRequired,
  completedCount: number,
  queueFiles: object.isRequired // eslint-disable-line react/forbid-prop-types
};

HomePage.defaultProps = {
  completedCount: 0
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
