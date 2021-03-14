const { ipcRenderer, shell, remote } = require('electron');
const ace                            = require('./assets/js/lib/ace.js');
const diff                           = require('./assets/js/lib/diff.js');
const {
    addWarningMessage,
    clearDiffContent,
    toggleClass,
    readFile,
    differenceCheck
} = require('./assets/js/utils.js');
const {
    sameMsg,
    emptyMsg,
    baseText,
    newText,
    editorConfig
} = require('./assets/js/constants.js');

const lt = ace.edit("lt");
const rt = ace.edit("rt");

lt.setOptions(editorConfig);
rt.setOptions(editorConfig);

const toggleDarkMode = () => {
    const toggleElem = document.querySelector('.dark-mode__toggle');
    toggleElem.classList.toggle('dark-mode__toggle-on');
};

// check events from updater
ipcRenderer.on('update-info', function (event, message, type, data) {
    const progressBar        = document.getElementById('update-progress');
    const progressBarValue   = document.querySelector('.progress-value');
    const progressBarMessage = document.querySelector('.progress-message');
    const progressBarDynamic = document.querySelector('.progress-dynamic');
    const progressContainer  = document.querySelector('.progress-container');

    if (progressContainer.classList.contains('hidden') && type !== 'not-available' && type !== 'error') {
        toggleClass(progressContainer, 'hidden', true);
    }

    const setProgressBar = () => {
        const percent = Math.floor(data.percent);
        progressBarMessage.textContent = (data.bytesPerSecond > 1024 * 1024)
            ? message + ' (' + Math.round(data.bytesPerSecond / 1024 / 1024, 2) + '  Mb/s)'
            : message + ' (' + Math.round(data.bytesPerSecond / 1024, 2) + '  kb/s)';
        progressBar.value = percent;
        progressBarValue.textContent = percent + "%";
        toggleClass(progressBarDynamic, 'hidden', true);
    }

    switch (type) {
    case 'available':
        progressBarMessage.textContent = message + ' (' + data.version + ')';
        break;
    case 'not-available':
        progressBarMessage.textContent = message;
        break;
    case 'progress':
        setProgressBar();
        break;
    case 'downloaded':
        progressBarMessage.textContent = message + ' (' + data.version + ')';
        setTimeout(() => { toggleClass(progressContainer, 'hidden'); }, 5000);
        break;
    case 'error':
        progressBarMessage.textContent = message;
    }
});

// set dark mode
ipcRenderer.on('set-dark-mode', () => toggleDarkMode());

// set drag content
const dragItems = document.querySelectorAll('.draggable');
document.ondragover = document.ondrop = e => { e.preventDefault(); }
dragItems.forEach(element => {
    element.ondrop = e => {
        e.preventDefault();
        toggleClass(e.target, 'drag-hover', true);
        readFile(e, element);
    }

    element.ondragenter = e => {
        toggleClass(e.target, 'drag-hover');
    };

    element.ondragleave = e => {
        toggleClass(e.target, 'drag-hover', true);
    };
});

// dark mode
document.querySelector('.dark-mode__wrapper').addEventListener('click', () => {
    ipcRenderer.send('toggle-dark-mode');
    toggleDarkMode();
});

// difference view
const differenceBtn = document.getElementById('differenceBtn');
differenceBtn.addEventListener('click', () => {
    document.getElementById('diffBtn').click();
});

// display type
const displayTypeBtn = document.querySelectorAll('.displayType');
displayTypeBtn.forEach(element => {
    element.addEventListener('change', () => {
        document.getElementById('diffBtn').click();
    });
});

// reset textarea field
const resetBtn = document.querySelectorAll('.reset-area');
resetBtn.forEach(element => {
    element.addEventListener('click', e => {
        const elem = e.target.previousElementSibling.id;
        ace.edit(elem).setValue("");
    });
});

// diff button action
const diffBtn = document.getElementById('diffBtn');
diffBtn.addEventListener('click', () => {
    // get content from both containers
    const leftContent = lt.getValue();
    const rightContent = rt.getValue();

    const warningBlock = document.querySelector('.warning-container');
    const diffBlock = document.querySelector('.diff-container');

    // hide and clear diff container
    toggleClass(diffBlock, 'hidden');
    clearDiffContent(diffBlock);

    if (leftContent.length && rightContent.length) {
        if (leftContent === rightContent) {
            // show warning message
            addWarningMessage(warningBlock, sameMsg);
            toggleClass(warningBlock, 'hidden', true);
        } else {
            // hide warning block if visible
            toggleClass(warningBlock, 'hidden');

            // run diff
            const lc = diff.lib.stringAsLines(leftContent);
            const rc = diff.lib.stringAsLines(rightContent);
            diff.lib.SequenceMatcher(lc, rc);
            const opcodes = diff.lib.get_opcodes();

            // set view type
            let viewType = false;
            const displayTypeBtn = document.querySelectorAll('.displayType');
            displayTypeBtn.forEach(el => { if (el.checked) { viewType = el.value } });

            diffBlock.appendChild(diff.view.buildView({
                baseTextLines: lc,
                newTextLines:  rc,
                opcodes:       opcodes,
                baseTextName:  baseText,
                newTextName:   newText,
                contextSize:   null,
                viewType:      viewType === '0' ? 0 : 1
            }));

            // show options
            const optionsBox = document.querySelector('.options-container');
            toggleClass(optionsBox, 'hidden', true);

            // check selected difference option
            differenceCheck();

            // show diff container
            toggleClass(diffBlock, 'hidden', true);
        }
    } else {
        // show warning (textareas not filled)
        addWarningMessage(warningBlock, emptyMsg);
        toggleClass(warningBlock, 'hidden', true);
    }
});

// diablog box with about info
const aboutInfo = document.querySelector('.about-info');
aboutInfo.addEventListener('click', function() {
    remote.dialog.showMessageBox({
        type:    'info',
        buttons: ['OK'],
        title:   'About',
        message: "Diff Checker", // electron.app.getName()
        detail:  'Version: ' + remote.app.getVersion() + '\n\nLibs: \n- ace (ajaxorg)\n- jsdifflib (cemerick)'
    });
});

// open Github link in default browser
const gitLink = document.querySelector('.github-info');
gitLink.addEventListener('click', () => {
    shell.openExternal('https://github.com/trembacz/diff-checker')
});
