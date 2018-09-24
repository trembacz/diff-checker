const { Menu, dialog } = require('electron')
const electron = require('electron')

class MenuManager {
  constructor() {
    this.env = !process.env.NODE_ENV ? 'production' : null;
  }

  setWindow(window) {
    this.mainWindow = window;
  }

  setEvents() {
    this.mainWindow.webContents.on('context-menu', (e, props) => {
      const { selectionText, isEditable } = props;
      if (isEditable) {
        this.textareaMenu.popup(this.mainWindow);
      } else if (selectionText && selectionText.trim() !== '') {
        this.selectionMenu.popup(this.mainWindow);
      }
    });
  }

  buildMenu() {
    // main menu
    const file = {
      label: 'File',
      submenu: [
        {
          label: 'Quit',
          role: 'quit',
          accelerator: 'CmdOrCtrl+Q'
        }
      ]
    };

    const edit = {
      label: "Edit",
      submenu: [
        {
          label: "Undo",
          accelerator: "CmdOrCtrl+Z",
          selector: "undo:"
        },
        {
          label: "Redo",
          accelerator: "Shift+CmdOrCtrl+Z",
          selector: "redo:"
        },
        {
          type: "separator"
        },
        {
          label: "Cut",
          accelerator: "CmdOrCtrl+X",
          selector: "cut:"
        },
        {
          label: "Copy",
          accelerator: "CmdOrCtrl+C",
          selector: "copy:"
        },
        {
          label: "Paste",
          accelerator: "CmdOrCtrl+V",
          selector: "paste:"
        },
        {
          label: "Select All",
          accelerator: "CmdOrCtrl+A",
          selector: "selectAll:"
        }
      ]
    };

    const about = {
      role: 'help',
      submenu: [
        {
          label: 'About',
          click () { 
            dialog.showMessageBox({ 
              type: 'info',
              buttons: ['OK'],
              title: 'About',
              message: "Diff Checker", // electron.app.getName()
              detail: 'Version: ' + electron.app.getVersion() + '\n\nLibs: \n- ace (ajaxorg)\n- jsdifflib (cemerick)'
            });
          }
        },
        {
          label: 'GitHub',
          click () { 
            electron.shell.openExternal('https://github.com/trembacz/diff-checker') 
          }
        }
      ]
    };

    const mainMenuTemplate = process.platform == 'darwin' ? [ file, edit, about ] : [ file, about ];

    // add developer tools option if on dev env
    if (this.env !== 'production') {
      mainMenuTemplate.push({
        label: 'Tools',
        submenu:[
          {
            role: 'reload'
          },
          {
            label: 'Toggle DevTools',
            accelerator: 'CmdOrCtrl+I',
            click(e, focusedWindow){
              focusedWindow.toggleDevTools();
            }
          }
        ]
      });
    }

    // context menu
    const selectionMenuTemplate = [
      { role: 'copy' },
      { type: 'separator' },
      { role: 'selectall' },
    ]

    const textareaMenuTemplate = [
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { type: 'separator' },
      { role: 'selectall' },
    ]

    // build main menu
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);

    // build context menu
    this.textareaMenu = Menu.buildFromTemplate(textareaMenuTemplate);
    this.selectionMenu = Menu.buildFromTemplate(selectionMenuTemplate);

    this.setEvents();
  }
}

module.exports = MenuManager;