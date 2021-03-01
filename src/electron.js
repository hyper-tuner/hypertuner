const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

const isDev = !app.isPackaged;

let main;
let splash;

const createSplash = () => {
  splash = new BrowserWindow({
    width: 200,
    height: 400,
    frame: false,
    transparent: true,
    resizable: false,
  });
  splash.loadURL(`file://${path.join(__dirname, '../public/splash.html')}`);

  splash.on('closed', () => {
    splash = null;
  });

  splash.webContents.on('did-finish-load', () => {
    splash.show();
  });
};

function createMain() {
  main = new BrowserWindow({
    title: 'SpeedyTuner',
    width: 1400,
    height: 1000,
    show: false,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#222629',
  });
  main.setMenuBarVisibility(false);

  const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  main.loadURL(startURL);

  main.on('closed', () => {
    main = null;
  });

  main.webContents.setWindowOpenHandler((event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  main.once('ready-to-show', () => main.show());
  // main.webContents.on('did-finish-load', () => {
  //   if (splash) {
  //     splash.close();
  //   }
  //   main.show();
  // });
}

app.on('ready', () => {
  createSplash();
  createMain();
});
