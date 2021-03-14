const fs = require('fs');

const addWarningMessage = (el, message) => el.textContent = message;
const clearDiffContent = el => el.innerHTML = '';
const toggleClass = (el, className, flag) => flag ? el.classList.remove(className) : el.classList.add(className);

const readFile = (item, editor) => {
    if (item.dataTransfer.files[0]) {
        const {path} = item.dataTransfer.files[0];
        if (item.target.classList && item.target.classList.contains('ace_content')) {
            const string = fs.readFileSync(path).toString();
            ace.edit(editor.id).setValue(string);
        }
    }
}

const differenceCheck = () => {
    const items = document.querySelectorAll('.diff tbody tr td.equal');
    const isChecked = document.getElementById('differenceBtn').checked;
    items.forEach(el => { toggleClass(el.parentElement, 'hidden', !isChecked) });
}

module.exports = {
    addWarningMessage,
    clearDiffContent,
    toggleClass,
    readFile,
    differenceCheck
}
