const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

const isDev = !app.isPackaged;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    title: 'SpeedyTuner',
    width: 1400,
    height: 1000,
    show: false,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#222629',
  });
  mainWindow.setMenuBarVisibility(false);

  const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  mainWindow.once('ready-to-show', () => mainWindow.show());
}

app.on('ready', createWindow);
