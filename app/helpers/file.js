/* eslint-disable import/prefer-default-export */
export const getFileIcon = filename => {
  const extension = filename.slice(
    (Math.max(0, filename.lastIndexOf('.')) || Infinity) + 1
  );

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
      return { icon: 'fas fa-volume-up', color: '#03A9F4' };
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
      return { icon: 'fas fa-archive', color: '#FFC107' };
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
    case 'webp':
      return { icon: 'far fa-image', color: '#536DFE' };
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
      return { icon: 'fas fa-code', color: '#673AB7' };
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
      return { icon: 'fas fa-video', color: '#F44336' };
    // PowerPoint files
    case 'pps':
    case 'ppt':
    case 'pptx':
      return { icon: 'fas fa-file-powerpoint', color: '#d24726' };
    // Excel files
    case 'xlr':
    case 'xls':
    case 'xlsx':
      return { icon: 'fas fa-file-excel', color: '#217346' };
    // Word Files
    case 'doc':
    case 'docx':
      return { icon: 'fas fa-file-word', color: '#2b579a' };
    // Text files
    case 'odt':
    case 'rtf':
    case 'tex':
    case 'txt':
    case 'wks':
    case 'wps':
    case 'wpd':
    case 'pages':
      return { icon: 'fas fa-file-alt', color: '#607D8B' };
    // pdf files
    case 'pdf':
      return { icon: 'fas fa-file-pdf', color: '#ff0000' };
    // ebook Files
    case 'azw3':
    case 'azw':
    case 'epub':
    case 'mobi':
    case 'oeb':
    case 'iba':
      return { icon: 'fas fa-book', color: '#FF9800' };
    default:
      return { icon: 'fas fa-file', color: '#000' };
  }
};

export const humanFileSize = (bytes, si) => {
  const thresh = si ? 1000 : 1024;
  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`;
  }
  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  do {
    bytes /= thresh; // eslint-disable-line
    ++u; // eslint-disable-line
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return `${bytes.toFixed(1)} ${units[u]}`;
};
