import React from 'react';
import styles from './FileList.scss';

import FileRow from './FileRow';

const FileList = () => (
  <div className={styles.container}>
    <p className={styles.title}>
      Your Files
    </p>
    <div className={styles.list}>
      <FileRow fileName="file.png" />
      <FileRow fileName="file.mp4" />
      <FileRow fileName="file.7z" />
      <FileRow fileName="file.js" />
      <FileRow fileName="file.xls" />
      <FileRow fileName="file.docx" />
      <FileRow fileName="file.ppt" />
      <FileRow fileName="file.pdf" />
      <FileRow fileName="file.txt" />
      <FileRow fileName="file.tar" />
      <FileRow fileName="file.other" />
    </div>
  </div>
);

export default FileList;
