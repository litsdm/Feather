import React from 'react';
import { connect } from 'react-redux';
import { arrayOf, bool, func, string } from 'prop-types';
import { fileShape } from '../shapes';

import Home from '../components/Home';

import { removeFile } from '../actions/file';
import { downloadFile } from '../actions/download';
import { awaitSendForFiles } from '../actions/upload';

const mapStateToProps = ({ file: { files, isFetching }, user }) => ({
  files,
  userId: user.id,
  isFetching
});

const mapDispatchToProps = dispatch => ({
  dDownloadFile: (fileId, url, filename) =>
    dispatch(downloadFile(fileId, url, filename)),
  dRemoveFile: index => dispatch(removeFile(index)),
  dAwaitSendForFiles: files => dispatch(awaitSendForFiles(files))
});

const HomePage = ({
  files,
  userId,
  isFetching,
  dDownloadFile,
  dRemoveFile,
  dAwaitSendForFiles
}) => (
  <Home
    files={files}
    userId={userId}
    isFetching={isFetching}
    downloadFile={dDownloadFile}
    removeFile={dRemoveFile}
    awaitSendForFiles={dAwaitSendForFiles}
  />
);

HomePage.propTypes = {
  files: arrayOf(fileShape).isRequired,
  userId: string.isRequired,
  isFetching: bool.isRequired,
  dDownloadFile: func.isRequired,
  dRemoveFile: func.isRequired,
  dAwaitSendForFiles: func.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
