# Diff Checker

Desktop application to compare text differences between two files.

![](https://i.imgur.com/QH2cHIH.png)

## Informations

Now instead of using *online tools* you can use this application directly from your *computer*.

### Overview

*Diff Checker* has been written using Electron, it's available for **Windows**, **MacOS** and **Linux**.  
  
You can download latest version from [here](https://github.com/trembacz/diff-checker/releases).

| Platform | File |
| -------- | ---- |
| Windows | `diff-checker-web-setup-{VERSION}.exe` |
| Mac\* | `Diff-Checker-{VERSION}.dmg` |
| Linux | `diff-checker-{VERSION}-i386.AppImage` <br/> `diff-checker-{VERSION}-x86_64.AppImage` |

#### MacOS\* installation:
**Application doesn't contain production sign so you will see notification that you want to run application from *unidentified developer*. There are two ways to run not signed apps:**
  
Open ***Apple menu > System Preferences, click Security & Privacy, then click General tab***
1. Click the ***“Open Anyway”*** button. This button is available for about an hour after you try to open the app.
2. Click the Lock icon in the bottom left of that window, make sure you have the option ***“Allow Applications Downloaded from: Anywhere”*** selected and click *“OK”*.

### Features:
- drag and drop files or text directly into textarea fields
- remember window size and position
- auto updates

### Options

After you click on *Diff items* button, options box will appear. To show avaliable options just click on the *Options* text.

* **Show difference only** - choose if you want to display **only difference** or **whole diff (with not modified lines)**
* **Format** - choose between two layouts (Side by Side or Inline)
  
---
  
### Side by side format
![](https://i.imgur.com/8SCndEC.png "Side by side")
  
---
  
### Inline format
![](https://i.imgur.com/meHeYp4.png "Inline")
  
---
  
### Side by side format with difference only
![](https://i.imgur.com/g5Ty8JC.png "Side by side format with difference only")
  
---
  
### Inline format with difference only
![](https://i.imgur.com/L1ojJqw.png "Inline format with difference only")
  
---
  
### Todo
- [x] mac release
- [x] linux release
- [ ] app hangs on large files
- [ ] layout improvements, better icon
- [ ] save last used options

**If you have any idea, just let me know.**

## Updating

Application have built in auto updater so you don't need to do anything, if new version will be available it will inform you.

### Downloading update
![](https://i.imgur.com/1xmUqta.png "Downloading update")
  
---
  
### Update notification
![](https://i.imgur.com/MFjXevm.png "Update notification")

## Versioning

For the versions available, see the [tags](https://github.com/trembacz/diff-checker/tags) or [releases](https://github.com/trembacz/diff-checker/releases)

## Authors

* **Tomasz Rembacz**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

Modified version of [jsdifflib](https://github.com/cemerick/jsdifflib) has been used.
