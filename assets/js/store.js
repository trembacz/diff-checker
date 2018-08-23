const electron = require('electron');
const path = require('path');
const fs = require('fs');

class StoreManager {
  constructor(options) {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    this.path = path.join(userDataPath, options.configName + '.json');
    this.data = this.parseDataFile(this.path, options.defaults);
  }
 
  get(key) {
    return this.data[key];
  }
  
  set(key, val) {
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }

  parseDataFile(filePath, defaults) {
    try {
      return JSON.parse(fs.readFileSync(filePath));
    } catch(error) {
      return defaults;
    }
  }

  setWindow(window) {
    this.mainWindow = window;
  }

  setEvents() {
    const self = this;
    this.data.maximized && this.mainWindow.maximize();
    ['resize', 'move', 'close'].forEach(e => { 
      self.mainWindow.on(e, function() { 
        const maximized = self.mainWindow.isMaximized();
        const { width, height, x, y } = self.mainWindow.getBounds();
        self.set('windowBounds', { width, height, x, y, maximized });
      }); 
    });
  }
}

module.exports = StoreManager;