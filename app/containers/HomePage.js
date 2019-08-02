import React from 'react';
import { connect } from 'react-redux';
import { arrayOf, bool, func, number, object, shape, string } from 'prop-types';
import { fileShape } from '../shapes';

import Home from '../components/Home';

import { removeFile } from '../actions/file';
import { awaitRecipients, downloadFile } from '../actions/queue';
import { removeDownloaded } from '../actions/download';

const mapStateToProps = ({
  file: { files, isFetching },
  user,
  queue: { files: queueFiles, completedCount },
  download: dlFiles
}) => ({
  files,
  queueFiles,
  userId: user.id,
  isFetching,
  completedCount,
  dlFiles
});

const mapDispatchToProps = dispatch => ({
  dDownloadFile: (fileId, url, filename) =>
    dispatch(downloadFile(fileId, url, filename)),
  dRemoveFile: index => dispatch(removeFile(index)),
  waitForRecipients: files => dispatch(awaitRecipients(files)),
  removeDlPath: fileID => dispatch(removeDownloaded(fileID))
});

const HomePage = ({
  files,
  userId,
  isFetching,
  dDownloadFile,
  dRemoveFile,
  waitForRecipients,
  queueFiles,
  completedCount,
  dlFiles,
  removeDlPath
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
    dlFiles={dlFiles}
    removeDlPath={removeDlPath}
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
  dlFiles: shape({ fileID: string }),
  removeDlPath: func.isRequired,
  queueFiles: object.isRequired // eslint-disable-line react/forbid-prop-types
};

HomePage.defaultProps = {
  completedCount: 0,
  dlFiles: {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
