const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron');

const StoreManager  = require('./assets/js/store.js');
const MenuManager   = require('./assets/js/menu.js');
const UpdateManager = require('./assets/js/update.js');

const appIcon = './assets/icons/png/64x64.png';

const menuManager   = new MenuManager();
const updateManager = new UpdateManager();
const storeManager  = new StoreManager({
    configName: 'preferences',
    defaults:   {
        windowBounds: {
            width:     1000,
            height:    800,
            x:         undefined,
            y:         undefined,
            maximized: false
        },
        darkMode: false,
    },
});

let mainWindow;

function createWindow() {
    // get data from store
    let { width, height, x, y, maximized } = storeManager.get('windowBounds');
    mainWindow = new BrowserWindow({
        x, y,
        width, height,
        maximized,
        icon:           appIcon,
        minWidth:       700,
        minHeight:      740,
        webPreferences: {
            enableRemoteModule: true,
            contextIsolation:   false,
            nodeIntegration:    true
        }});

    mainWindow.loadFile('index.html');

    // check if we need to maximize main window
    maximized && mainWindow.maximize();

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

    ipcMain.on('toggle-dark-mode', function () {
        if (nativeTheme.shouldUseDarkColors) {
            nativeTheme.themeSource = 'light'
            storeManager.set('darkMode', false);
        } else {
            nativeTheme.themeSource = 'dark'
            storeManager.set('darkMode', true);
        }
        return nativeTheme.shouldUseDarkColors
    });

    mainWindow.webContents.on('did-finish-load', () => {
        // set dark mode on load
        if (storeManager.get('darkMode')) {
            mainWindow.webContents.send('set-dark-mode');
            nativeTheme.themeSource = 'dark';
        }
    });

    mainWindow.on('closed', function() { mainWindow = null });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', function() { if (process.platform !== 'darwin') { app.quit(); } });
app.on('activate', function() { if (mainWindow === null) { createWindow(); } });
