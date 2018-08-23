var { dialog } = require('electron');
const { autoUpdater } = require("electron-updater");

class UpdateManager {
  constructor() {
    this.setEvents();
  }

  setWindow(window) {
    this.mainWindow = window;
  }

  sendStatusToWindow(text, type, data) {
    this.mainWindow && this.mainWindow.webContents && this.mainWindow.webContents.send('update-info', text, type, data);
  }

  setEvents() {
    autoUpdater.autoInstallOnAppQuit = false;
    autoUpdater.on('update-available', info => { this.sendStatusToWindow('Update available', 'available', { ...info }); });
    autoUpdater.on('update-not-available', info => { this.sendStatusToWindow('Update not available.', 'not-available', { ...info }); });
    autoUpdater.on('error', err => { this.sendStatusToWindow('Error in auto-updater. ' + err, 'error'); });
    autoUpdater.on('download-progress', progressObj => { this.sendStatusToWindow('Downloading update...', 'progress', { ...progressObj }); });
    autoUpdater.on('update-downloaded', ({ version }) => {
      this.sendStatusToWindow('Update downloaded', 'downloaded', { version });
      const dialogOpts = {
        type: 'info',
        buttons: ['Restart', 'Later'],
        title: 'Diff Checker Update',
        message: 'A new version (' + version + ') has been downloaded.\nPlease restart the application to apply the updates.'
      }
      dialog.showMessageBox(dialogOpts, response => { response === 0 && autoUpdater.quitAndInstall(); });
    });
  }

  checkForUpdate() {
    autoUpdater.checkForUpdates();
  }
}

module.exports = UpdateManager;