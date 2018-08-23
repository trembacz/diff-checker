const { app, BrowserWindow, Menu, dialog } = require('electron');
const { autoUpdater } = require("electron-updater");
const { mainMenuTemplate, textareaMenuTemplate, selectionMenuTemplate } = require('./assets/js/menu.js');
const Store = require('./assets/js/store.js');

let mainWindow;

// set new store for window settings
const store = new Store({
  configName: 'preferences',
  defaults: { windowBounds: { width: 1000, height: 800, x: undefined, y: undefined, maximized: false } }
});

function createWindow () {
  // get data from store
  let { width, height, x, y, maximized } = store.get('windowBounds');

  // set main window
  mainWindow = new BrowserWindow({ x, y, width, height, maximized, icon: './assets/icons/png/64x64.png' });
  mainWindow.loadFile('index.html');

  // show dev tools on start
  // mainWindow.webContents.openDevTools();
  
  // set window bounds
  maximized && mainWindow.maximize();
  ['resize', 'move', 'close'].forEach(e => { 
    mainWindow.on(e, function() { 
      const maximized = mainWindow.isMaximized();
      const { width, height, x, y } = mainWindow.getBounds();
      store.set('windowBounds', { width, height, x, y, maximized });
    }); 
  });

  mainWindow.on('closed', function () { mainWindow = null });

  // check for updates
  autoUpdater.checkForUpdates();

  // build main menu
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);

  // build context menu
  const textareaMenu = Menu.buildFromTemplate(textareaMenuTemplate);
  const selectionMenu = Menu.buildFromTemplate(selectionMenuTemplate);

  mainWindow.webContents.on('context-menu', (e, props) => {
    const { selectionText, isEditable } = props;
    if (isEditable) {
      textareaMenu.popup(mainWindow);
    } else if (selectionText && selectionText.trim() !== '') {
      selectionMenu.popup(mainWindow);
    }
  });
}

app.on('ready', createWindow);
app.on('window-all-closed', function () { if (process.platform !== 'darwin') { app.quit(); } });
app.on('activate', function () { if (mainWindow === null) { createWindow(); } });

const sendStatusToWindow = (text, type, data) => {
  mainWindow && mainWindow.webContents && mainWindow.webContents.send('update-info', text, type, data);
}

// updater events
autoUpdater.autoInstallOnAppQuit = false;
autoUpdater.on('update-available', info => { sendStatusToWindow('Update available', 'available', { ...info }); });
autoUpdater.on('update-not-available', info => { sendStatusToWindow('Update not available.', 'not-available', { ...info }); });
autoUpdater.on('error', err => { sendStatusToWindow('Error in auto-updater. ' + err, 'error'); });
autoUpdater.on('download-progress', progressObj => { sendStatusToWindow('Downloading update...', 'progress', { ...progressObj }); });
autoUpdater.on('update-downloaded', ({ version }) => {
  sendStatusToWindow('Update downloaded', 'downloaded', { version });
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Diff Checker Update',
    message: 'A new version (' + version + ') has been downloaded.\nPlease restart the application to apply the updates.'
  }
  dialog.showMessageBox(dialogOpts, response => { response === 0 && autoUpdater.quitAndInstall(); });
});