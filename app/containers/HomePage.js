import React from 'react';
import { connect } from 'react-redux';
import { arrayOf, bool, func, number, object, shape, string } from 'prop-types';
import { fileShape } from '../shapes';

import Home from '../components/Home';

import { removeFileById } from '../actions/file';
import { removeSentFileById } from '../actions/sentFile';
import { awaitRecipients, downloadFile } from '../actions/queue';
import { removeDownloaded } from '../actions/download';

const mapStateToProps = ({
  file: { files, isFetching },
  sentFile: { files: sentFiles, isFetching: sentIsFetching },
  user,
  queue: { files: queueFiles, completedCount },
  download: dlFiles
}) => ({
  files,
  sentFiles,
  queueFiles,
  userId: user.id,
  isFetching: isFetching && sentIsFetching,
  completedCount,
  dlFiles
});

const mapDispatchToProps = dispatch => ({
  dDownloadFile: (fileId, url, filename) =>
    dispatch(downloadFile(fileId, url, filename)),
  removeFile: id => dispatch(removeFileById(id)),
  removeSentFile: id => dispatch(removeSentFileById(id)),
  waitForRecipients: files => dispatch(awaitRecipients(files)),
  removeDlPath: fileID => dispatch(removeDownloaded(fileID))
});

const HomePage = ({
  files,
  userId,
  isFetching,
  dDownloadFile,
  removeFile,
  removeSentFile,
  waitForRecipients,
  queueFiles,
  completedCount,
  dlFiles,
  sentFiles,
  removeDlPath
}) => (
  <Home
    files={files}
    userId={userId}
    isFetching={isFetching}
    downloadFile={dDownloadFile}
    removeFile={removeFile}
    awaitSendForFiles={waitForRecipients}
    queueFiles={queueFiles}
    completedCount={completedCount}
    dlFiles={dlFiles}
    removeDlPath={removeDlPath}
    sentFiles={sentFiles}
    removeSentFile={removeSentFile}
  />
);

HomePage.propTypes = {
  files: arrayOf(fileShape).isRequired,
  sentFiles: arrayOf(fileShape),
  userId: string.isRequired,
  isFetching: bool.isRequired,
  dDownloadFile: func.isRequired,
  removeFile: func.isRequired,
  removeSentFile: func.isRequired,
  waitForRecipients: func.isRequired,
  completedCount: number,
  dlFiles: shape({ fileID: string }),
  removeDlPath: func.isRequired,
  queueFiles: object.isRequired // eslint-disable-line react/forbid-prop-types
};

HomePage.defaultProps = {
  completedCount: 0,
  sentFiles: [],
  dlFiles: {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
