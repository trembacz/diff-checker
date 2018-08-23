const fs = require('fs');

const addWarningMessage = (el, message) => el.textContent = message;
const clearDiffContent = el => el.innerHTML = '';
const toggleClass = (el, className, flag) => flag ? el.classList.remove(className) : el.classList.add(className);

const readFile = item => {
  if (item.dataTransfer.files[0]) {
    const path = item.dataTransfer.files[0].path;
    item.target.value = fs.readFileSync(path).toString();
  } else {
    item.target.value = item.dataTransfer.getData("Text");
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