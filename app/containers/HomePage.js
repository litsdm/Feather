import React from 'react';
import { connect } from 'react-redux';
import { arrayOf, bool, func, number, string, object } from 'prop-types';
import { fileShape } from '../shapes';

import Home from '../components/Home';

import {
  addFile,
  finishUpload,
  updateProgress,
  removeFile
} from '../actions/file';
import { downloadFile } from '../actions/download';
import { awaitSendForFiles, uploadDirectly } from '../actions/upload';

const mapStateToProps = ({
  file: { isUploading, files, isFetching, uploadId, progress },
  user,
  downloads
}) => ({
  isUploading,
  files,
  userId: user.id,
  isFetching,
  downloads,
  uploadId,
  uploadProgress: progress
});

const mapDispatchToProps = dispatch => ({
  dUpdateProgress: progress => dispatch(updateProgress(progress)),
  dAddFile: (file, upload) => dispatch(addFile(file, upload)),
  dFinishUpload: () => dispatch(finishUpload()),
  dDownloadFile: (fileId, url, filename) =>
    dispatch(downloadFile(fileId, url, filename)),
  dRemoveFile: index => dispatch(removeFile(index)),
  dAwaitSendForFiles: files => dispatch(awaitSendForFiles(files)),
  uploadToPersonal: (files, send, addToUser = true) =>
    dispatch(uploadDirectly(files, send, addToUser))
});

const HomePage = ({
  isUploading,
  dAddFile,
  dFinishUpload,
  dUpdateProgress,
  files,
  userId,
  isFetching,
  dDownloadFile,
  downloads,
  uploadId,
  uploadProgress,
  dRemoveFile,
  dAwaitSendForFiles,
  uploadToPersonal
}) => (
  <Home
    isUploading={isUploading}
    addFile={dAddFile}
    finishUpload={dFinishUpload}
    updateProgress={dUpdateProgress}
    files={files}
    userId={userId}
    isFetching={isFetching}
    downloadFile={dDownloadFile}
    downloads={downloads}
    uploadId={uploadId}
    uploadProgress={uploadProgress}
    removeFile={dRemoveFile}
    awaitSendForFiles={dAwaitSendForFiles}
    uploadToPersonal={uploadToPersonal}
  />
);

HomePage.propTypes = {
  isUploading: bool.isRequired,
  dAddFile: func.isRequired,
  dFinishUpload: func.isRequired,
  dUpdateProgress: func.isRequired,
  files: arrayOf(fileShape).isRequired,
  userId: string.isRequired,
  isFetching: bool.isRequired,
  dDownloadFile: func.isRequired,
  downloads: object.isRequired, // eslint-disable-line react/forbid-prop-types
  uploadId: string,
  uploadProgress: number.isRequired,
  dRemoveFile: func.isRequired,
  dAwaitSendForFiles: func.isRequired,
  uploadToPersonal: func.isRequired
};

HomePage.defaultProps = {
  uploadId: ''
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
