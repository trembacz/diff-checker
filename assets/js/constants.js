const sameMsg = 'Both files are identical';
const emptyMsg = 'Please fill both fields';
const baseText = 'Original';
const newText = 'Changed';
const editorConfig = {
  wrap: true,
  printMargin: false,
  displayIndentGuides: false,
  useWorker: false,
  selectionStyle: "text"
}

module.exports = {
  sameMsg,
  emptyMsg,
  baseText,
  newText,
  editorConfig
}