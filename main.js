const { app, BrowserWindow } = require('electron');

const StoreManager = require('./assets/js/store.js');
const MenuManager = require('./assets/js/menu.js');
const UpdateManager = require('./assets/js/update.js');

let mainWindow;

const menuManager = new MenuManager();
const updateManager = new UpdateManager();
const storeManager = new StoreManager({
  configName: 'preferences',
  defaults: { windowBounds: { width: 1000, height: 800, x: undefined, y: undefined, maximized: false } }
});

function createWindow() {
  // get data from store
  let { width, height, x, y, maximized } = storeManager.get('windowBounds');

  // set main window
  mainWindow = new BrowserWindow({ x, y, width, height, maximized, icon: './assets/icons/png/64x64.png' });
  mainWindow.loadFile('index.html');

  // set main window
  storeManager.setWindow(mainWindow);
  menuManager.setWindow(mainWindow);
  updateManager.setWindow(mainWindow);
  
  // set window bounds events
  storeManager.setEvents();

  // build menu
  menuManager.buildMenu();

  // check for update
  updateManager.checkForUpdate();

  // show dev tools on start
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function() { mainWindow = null });
}

app.on('ready', createWindow);
app.on('window-all-closed', function() { if (process.platform !== 'darwin') { app.quit(); } });
app.on('activate', function() { if (mainWindow === null) { createWindow(); } });