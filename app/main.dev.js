/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, Tray, ipcMain, nativeImage } from 'electron';
import { download } from 'electron-dl';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import path from 'path';
import MenuBuilder from './menu';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    if (process.env.NODE_ENV === 'production')
      autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow = null;
let tray = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

const createTray = () => {
  const iconPath = path.join(
    __dirname,
    `./assets/iconTemplate.${process.platform === 'darwin' ? 'png' : 'ico'}`
  );
  const image = nativeImage.createFromPath(iconPath);
  image.setTemplateImage(true);

  tray = new Tray(image);
  tray.on('right-click', toggleWindow);
  tray.on('double-click', toggleWindow);
  tray.on('click', () => {
    toggleWindow();
  });
  tray.on('drop-files', uploadFiles);
};

const toggleWindow = () => {
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    showWindow();
  }
};

const showWindow = () => {
  const position = getWindowPosition();
  if (process.platform === 'darwin')
    mainWindow.setPosition(position.x, position.y, false);
  mainWindow.show();
  mainWindow.setVisibleOnAllWorkspaces(true);
  mainWindow.focus();
  mainWindow.setVisibleOnAllWorkspaces(false);
};

const getWindowPosition = () => {
  const windowBounds = mainWindow.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below the tray icon
  const x = Math.round(
    trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2
  );

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 6);

  return { x, y };
};

const uploadFiles = (e, files) => {
  if (mainWindow.isVisible()) {
    mainWindow.focus();
  } else {
    showWindow();
  }

  mainWindow.webContents.send('upload-from-tray', files);
};

const downloadFile = (url, filename, fileId, dlPath, sender) => {
  download(mainWindow, url, {
    directory: dlPath,
    onProgress: progress =>
      sender.send('download-progress', { progress, fileId })
  })
    .then(dl => {
      const savePath = dl
        .getSavePath()
        .split(' ')
        .join('\\ ');

      const res = {
        fileId,
        filename,
        savePath
      };

      sender.send('download-finish', res);
      return dl;
    })
    .catch(err => console.log(err));
};

/**
 * Add event listeners...
 */

ipcMain.on('download-file', (e, { url, filename, fileId, localPath }) => {
  const downloadPath = localPath || app.getPath('downloads');
  downloadFile(url, filename, fileId, downloadPath, e.sender);
});

ipcMain.on('show-window', () => {
  showWindow();
});

ipcMain.on('quitApp', () => {
  app.quit();
});

autoUpdater.on('update-downloaded', () => {
  console.log('update ready');
  mainWindow.webContents.send('updateReady');
});

ipcMain.on('quitAndInstall', () => {
  autoUpdater.quitAndInstall();
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  const platformOptions =
    process.platform === 'darwin'
      ? {
          width: 320,
          height: 560,
          transparent: true
        }
      : {
          width: 400,
          height: 560,
          transparent: false
        };

  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    webPreferences: {
      backgroundThrottling: false
    },
    ...platformOptions
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  createTray();

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      showWindow();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
});
