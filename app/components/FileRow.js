import React, { Fragment } from 'react';
import { object, func, number, string } from 'prop-types';
import styles from './FileRow.scss';

import Progressbar from './Progressbar';

const FileRow = ({ downloads, downloadFile, fileName, id, size, url }) => {
  const getState = () => {
    if (typeof downloads[id] !== 'undefined') return 'downloading';

    return 'default';
  };

  const getFileIcon = () => {
    const extension = fileName.slice((Math.max(0, fileName.lastIndexOf(".")) || Infinity) + 1);

    switch (extension.toLowerCase()) {
      // Audio Files
      case 'aif':
      case 'mid':
      case 'midi':
      case 'mp3':
      case 'mpa':
      case 'ogg':
      case 'wav':
      case 'wma':
      case 'wpl':
        return { icon: 'far fa-file-audio', color: '#03A9F4' };
      // Compressed files
      case '7z':
      case 'arj':
      case 'deb':
      case 'pkg':
      case 'rar':
      case 'rpm':
      case 'z':
      case 'zip':
      case 'gz':
        return { icon: 'far fa-file-archive', color: '#FFC107' };
      // Image files
      case 'ai':
      case 'bmp':
      case 'gif':
      case 'ico':
      case 'jpeg':
      case 'jpg':
      case 'png':
      case 'ps':
      case 'psd':
      case 'svg':
      case 'tif':
      case 'tiff':
      case 'icns':
        return { icon: 'far fa-file-image', color: '#536DFE' };
      // Code files
      case 'asp':
      case 'aspx':
      case 'cer':
      case 'cfm':
      case 'cgi':
      case 'pl':
      case 'css':
      case 'scss':
      case 'less':
      case 'htm':
      case 'html':
      case 'js':
      case 'jsp':
      case 'jsx':
      case 'php':
      case 'py':
      case 'rss':
      case 'xhtml':
      case 'xml':
      case 'c':
      case 'class':
      case 'cpp':
      case 'cs':
      case 'h':
      case 'java':
      case 'sh':
      case 'swift':
      case 'vb':
      case 'json':
      case 'babelrc':
      case 'yml':
        return { icon: 'far fa-file-code', color: '#673AB7' };
      // Video files
      case '3g2':
      case '3gp':
      case 'avi':
      case 'flv':
      case 'h264':
      case 'm4v':
      case 'mkv':
      case 'mov':
      case 'mp4':
      case 'mpg':
      case 'mpeg':
      case 'rm':
      case 'swf':
      case 'vob':
      case 'wmv':
        return { icon: 'far fa-file-video', color: '#F44336' };
      // PowerPoint files
      case 'pps':
      case 'ppt':
      case 'pptx':
        return { icon: 'far fa-file-powerpoint', color: '#d24726' };
      // Excel files
      case 'xlr':
      case 'xls':
      case 'xlsx':
        return { icon: 'far fa-file-excel', color: '#217346' };
      // Word Files
      case 'doc':
      case 'docx':
        return { icon: 'far fa-file-word', color: '#2b579a' };
      // Text files
      case 'odt':
      case 'rtf':
      case 'tex':
      case 'txt':
      case 'wks':
      case 'wps':
      case 'wpd':
      case 'pages':
        return { icon: 'far fa-file-alt', color: '#607D8B' };
      // pdf files
      case 'pdf':
        return { icon: 'far fa-file-pdf', color: '#ff0000' };
      default:
        return { icon: 'far fa-file', color: '#000' };
    }
  }

  const humanFileSize = (bytes, si) => {
    const thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return `${bytes} B`;
    }
    const units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    let u = -1;
    do {
        bytes /= thresh; // eslint-disable-line
        ++u; // eslint-disable-line
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return `${bytes.toFixed(1)} ${units[u]}`;
  }

  const state = getState();
  const fileIcon = getFileIcon();

  const renderInfoSection = () => {
    if (state === 'downloading') {
      return <Progressbar progress={downloads[id].progress} action={state} />
    }

    return (
      <Fragment>
        <p className={styles.expiry}>
          Expires in x hours
        </p>
        <p className={styles.size}>
          {humanFileSize(size, true)}
        </p>
      </Fragment>
    );
  }

  return (
    <div className={styles.row}>
      <div className={styles.top}>
        <div className={styles.info}>
          <i className={fileIcon.icon} style={{ color: fileIcon.color }} />
          <p className={styles.name}>
            {fileName}
          </p>
        </div>
        {
          state === 'default'
            ? (
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.download}
                  onClick={() => downloadFile(id, url, fileName)}
                >
                  <i className="fa fa-download" />
                </button>
                <button type="button" className={styles.delete}>
                  <i className="fa fa-trash-alt" />
                </button>
              </div>
            )
            : null
        }
      </div>
      <div className={styles.bottom}>
        {renderInfoSection()}
      </div>
    </div>
  );
}

FileRow.propTypes = {
  fileName: string.isRequired,
  size: number.isRequired,
  url: string.isRequired,
  downloads: object.isRequired, // eslint-disable-line
  downloadFile: func.isRequired,
  id: string.isRequired
};

export default FileRow;
